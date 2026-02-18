import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation Schema für OrderItem
const orderItemSchema = z.object({
  orderId: z.string().min(1, 'Bestellungs-ID ist erforderlich'),
  productId: z.string().optional().nullable(),
  sku: z.string().min(1, 'Artikelnummer ist erforderlich'),
  name: z.string().min(1, 'Produktname ist erforderlich'),
  price: z.number().positive('Preis muss positiv sein'),
  quantity: z.number().min(1, 'Menge muss mindestens 1 sein'),
  total: z.number().positive('Gesamtbetrag muss positiv sein'),
})

// GET /api/order-items - Alle Bestellpositionen abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const orderId = searchParams.get('orderId')
    const productId = searchParams.get('productId')

    // Filter erstellen
    const where: {
      orderId?: string
      productId?: string
    } = {}
    
    if (orderId) where.orderId = orderId
    if (productId) where.productId = productId

    const [orderItems, total] = await Promise.all([
      prisma.orderItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      }),
      prisma.orderItem.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: orderItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellpositionen:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// POST /api/order-items - Neue Bestellposition erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    const validation = orderItemSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validierungsfehler',
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    // Prüfen, ob die Bestellung existiert
    const order = await prisma.order.findUnique({
      where: { id: validation.data.orderId },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Bestellung nicht gefunden' },
        { status: 404 }
      )
    }

    // Prüfen, ob das Produkt existiert (falls productId angegeben)
    if (validation.data.productId) {
      const product = await prisma.product.findUnique({
        where: { id: validation.data.productId },
      })

      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Produkt nicht gefunden' },
          { status: 404 }
        )
      }
    }

    // Bestellposition erstellen
    const orderItem = await prisma.orderItem.create({
      data: validation.data,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, data: orderItem },
      { status: 201 }
    )
  } catch (error) {
    console.error('Fehler beim Erstellen der Bestellposition:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/order-items/order/:orderId - Bestellpositionen einer Bestellung
async function _GET_ORDER_ITEMS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Bestellungs-ID ist erforderlich' },
        { status: 400 }
      )
    }

    // Prüfen, ob die Bestellung existiert
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
          orderBy: { id: 'asc' },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Bestellung nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
        },
        items: (order as typeof order & { items: { total: number }[] }).items,
        itemCount: (order as typeof order & { items: { total: number }[] }).items.length,
        subtotal: (order as typeof order & { items: { total: number }[] }).items.reduce((sum: number, item: { total: number }) => sum + item.total, 0),
      },
    })
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellpositionen:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/order-items/stats - Bestellpositionen-Statistiken
async function _GET_STATS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: {
      order?: {
        createdAt?: {
          gte?: Date
          lte?: Date
        }
      }
    } = {}
    
    if (dateFrom || dateTo) {
      where.order = {
        createdAt: {},
      }
      if (dateFrom) where.order.createdAt!.gte = new Date(dateFrom)
      if (dateTo) where.order.createdAt!.lte = new Date(dateTo)
    }

    const [
      totalItems,
      totalQuantity,
      totalRevenue,
      topProducts,
      byOrder,
    ] = await Promise.all([
      prisma.orderItem.count({ where }),
      prisma.orderItem.aggregate({
        where,
        _sum: { quantity: true },
      }),
      prisma.orderItem.aggregate({
        where,
        _sum: { total: true },
      }),
      prisma.orderItem.groupBy({
        where,
        by: ['productId'],
        _sum: { quantity: true, total: true },
        _count: true,
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),
      prisma.orderItem.groupBy({
        where,
        by: ['orderId'],
        _sum: { quantity: true, total: true },
        _count: true,
        orderBy: { _sum: { total: 'desc' } },
        take: 10,
      }),
    ])

    // Produkt-Namen für topProducts hinzufügen
    const productIds = topProducts.map(p => p.productId).filter(id => id !== null) as string[]
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    })

    const topProductsWithNames = topProducts.map(product => ({
      ...product,
      productName: products.find(p => p.id === product.productId)?.name || 'Unbekannt',
    }))

    // Bestellungs-Nummern für byOrder hinzufügen
    const orderIds = byOrder.map(o => o.orderId)
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      select: { id: true, orderNumber: true },
    })

    const byOrderWithNumbers = byOrder.map(order => ({
      ...order,
      orderNumber: orders.find(o => o.id === order.orderId)?.orderNumber || 'Unbekannt',
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalItems,
        totalQuantity: totalQuantity._sum.quantity || 0,
        totalRevenue: totalRevenue._sum.total || 0,
        topProducts: topProductsWithNames,
        byOrder: byOrderWithNumbers,
      },
    })
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellpositionen-Statistiken:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// Silence unused variable warnings
void { _GET_ORDER_ITEMS, _GET_STATS };