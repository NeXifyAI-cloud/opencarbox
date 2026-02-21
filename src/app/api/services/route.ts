import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation Schema für Service
const serviceSchema = z.object({
  categoryId: z.string().optional().nullable(),
  name: z.string().min(1, 'Name ist erforderlich'),
  slug: z.string().min(1, 'Slug ist erforderlich'),
  description: z.string().optional().nullable(),
  priceFrom: z.number().min(0, 'Preis von darf nicht negativ sein').optional().nullable(),
  priceTo: z.number().min(0, 'Preis bis darf nicht negativ sein').optional().nullable(),
  priceType: z.enum(['FIXED', 'FROM', 'ON_REQUEST']).default('FIXED'),
  durationMinutes: z.number().min(1, 'Dauer muss mindestens 1 Minute sein').optional().nullable(),
  image: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
})

// Validation Schema für ServiceCategory
const serviceCategorySchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  slug: z.string().min(1, 'Slug ist erforderlich'),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
})

// GET /api/services - Alle Services abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const categoryId = searchParams.get('categoryId')
    const isActive = searchParams.get('isActive')

    // Filter erstellen
    const where: {
      categoryId?: string
      isActive?: boolean
    } = {}
    
    if (categoryId) where.categoryId = categoryId
    if (isActive !== null) where.isActive = isActive === 'true'

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
        },
      }),
      prisma.service.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error('Fehler beim Abrufen der Services:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// POST /api/services - Neuen Service erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    const validation = serviceSchema.safeParse(body)
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

    // Service erstellen
    const service = await prisma.service.create({
      data: validation.data,
      include: {
        category: true,
      },
    })

    return NextResponse.json(
      { success: true, data: service },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Fehler beim Erstellen des Services:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/services/categories - Alle Service-Kategorien abrufen
async function _GET_CATEGORIES(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [categories, total] = await Promise.all([
      prisma.serviceCategory.findMany({
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          services: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      }),
      prisma.serviceCategory.count(),
    ])

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error('Fehler beim Abrufen der Service-Kategorien:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// POST /api/services/categories - Neue Service-Kategorie erstellen
async function _POST_CATEGORY(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    const validation = serviceCategorySchema.safeParse(body)
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

    // Service-Kategorie erstellen
    const category = await prisma.serviceCategory.create({
      data: validation.data,
    })

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Fehler beim Erstellen der Service-Kategorie:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// Silence unused variable warnings
void { _GET_CATEGORIES, _POST_CATEGORY };