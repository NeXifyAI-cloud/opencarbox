import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation Schema
const orderSchema = z.object({
  userId: z.string().optional(),
  total: z.number().positive('Gesamtbetrag muss positiv sein'),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
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

    // Filter erstellen
    const where: {
      status?: string
      userId?: string
    } = {}
    if (status) where.status = status
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
    // console.error('Fehler beim Abrufen der Bestellungen:', error)
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

    // Bestellung erstellen
    const order = await prisma.order.create({
      data: validation.data,
    })

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    )
  } catch (error) {
    // console.error('Fehler beim Erstellen der Bestellung:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}