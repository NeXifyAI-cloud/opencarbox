import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation Schema
const orderSchema = z.object({
  userId: z.string().optional().nullable(),
  vehicleId: z.string().optional().nullable(),
  shippingAddressId: z.string().optional().nullable(),
  billingAddressId: z.string().optional().nullable(),
  orderNumber: z.string().min(1, 'Bestellnummer ist erforderlich'),
  subtotal: z.number().positive('Zwischensumme muss positiv sein'),
  shippingCost: z.number().min(0, 'Versandkosten dürfen nicht negativ sein').default(0),
  taxAmount: z.number().min(0, 'Steuerbetrag darf nicht negativ sein').default(0),
  discount: z.number().min(0, 'Rabatt darf nicht negativ sein').default(0),
  total: z.number().positive('Gesamtbetrag muss positiv sein'),
  paymentMethod: z.string().optional().nullable(),
  paymentIntentId: z.string().optional().nullable(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).default('PENDING'),
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).default('PENDING'),
  shippingMethod: z.string().optional().nullable(),
  trackingNumber: z.string().optional().nullable(),
  customerNote: z.string().optional().nullable(),
  internalNote: z.string().optional().nullable(),
})

// GET /api/orders - Alle Bestellungen abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    const VALID_ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']
    // Filter erstellen
    const where: {
      status?: string
      userId?: string
    } = {}
    if (status) {
      const statusUpper = status.toUpperCase()
      if (VALID_ORDER_STATUSES.includes(statusUpper)) {
        where.status = statusUpper
      }
    }
    if (userId) where.userId = userId

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.order.count({ where }),
      ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {

    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Neue Bestellung erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    const validation = orderSchema.safeParse(body)
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

    // Bestellung erstellen - entferne null/undefined Werte
    const orderData = {
      ...validation.data,
    }
    
    // Entferne userId wenn es null oder undefined ist
    if (!orderData.userId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId: _userId, ...rest } = orderData
      const order = await prisma.order.create({
        data: rest,
      })
      return NextResponse.json(
        { success: true, data: order },
        { status: 201 }
      )
    }
    
    const order = await prisma.order.create({
      data: orderData,
    })

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    )
  } catch (error) {

    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}