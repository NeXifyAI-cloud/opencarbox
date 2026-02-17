import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation Schema
const productSchema = z.object({
  sku: z.string().min(1, 'SKU ist erforderlich'),
  name: z.string().min(1, 'Name ist erforderlich'),
  description: z.string().optional(),
  price: z.number().positive('Preis muss positiv sein'),
  stock: z.number().int().min(0, 'Lagerbestand darf nicht negativ sein'),
})

// GET /api/products - Alle Produkte abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    // console.error('Fehler beim Abrufen der Produkte:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// POST /api/products - Neues Produkt erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    const validation = productSchema.safeParse(body)
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

    // Prüfen ob SKU bereits existiert
    const existingProduct = await prisma.product.findUnique({
      where: { sku: validation.data.sku },
    })

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Produkt mit dieser SKU existiert bereits' },
        { status: 409 }
      )
    }

    // Produkt erstellen
    const product = await prisma.product.create({
      data: validation.data,
    })

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    )
  } catch (error) {
    // console.error('Fehler beim Erstellen des Produkts:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}