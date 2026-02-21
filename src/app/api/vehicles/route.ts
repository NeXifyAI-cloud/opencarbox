import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation Schema für Vehicle
const vehicleSchema = z.object({
  userId: z.string().optional().nullable(),
  hsn: z.string().optional().nullable(),
  tsn: z.string().optional().nullable(),
  licensePlate: z.string().optional().nullable(),
  vin: z.string().optional().nullable(),
  brand: z.string().min(1, 'Marke ist erforderlich'),
  model: z.string().min(1, 'Modell ist erforderlich'),
  variant: z.string().optional().nullable(),
  year: z.number().min(1900, 'Baujahr muss mindestens 1900 sein').max(new Date().getFullYear() + 1, 'Baujahr darf nicht in der Zukunft liegen'),
  nickname: z.string().optional().nullable(),
  mileage: z.number().min(0, 'Kilometerstand darf nicht negativ sein').optional().nullable(),
  lastService: z.string().datetime().optional().nullable(),
  nextTuv: z.string().datetime().optional().nullable(),
})

// GET /api/vehicles - Alle Fahrzeuge abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const userId = searchParams.get('userId')
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')

    // Filter erstellen
    const where: {
      userId?: string
      brand?: { contains: string; mode: 'insensitive' }
      model?: { contains: string; mode: 'insensitive' }
    } = {}
    
    if (userId) where.userId = userId
    if (brand) where.brand = { contains: brand, mode: 'insensitive' }
    if (model) where.model = { contains: model, mode: 'insensitive' }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.vehicle.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: vehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error('Fehler beim Abrufen der Fahrzeuge:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// POST /api/vehicles - Neues Fahrzeug erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    const validation = vehicleSchema.safeParse(body)
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

    // Datumskonvertierung
    const vehicleData = {
      ...validation.data,
      lastService: validation.data.lastService ? new Date(validation.data.lastService) : null,
      nextTuv: validation.data.nextTuv ? new Date(validation.data.nextTuv) : null,
    }

    // Fahrzeug erstellen
    const vehicle = await prisma.vehicle.create({
      data: vehicleData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, data: vehicle },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Fehler beim Erstellen des Fahrzeugs:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/vehicles/search - Fahrzeuge nach HSN/TSN suchen
async function _GET_SEARCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hsn = searchParams.get('hsn')
    const tsn = searchParams.get('tsn')
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const year = searchParams.get('year')

    // Filter erstellen
    const where: {
      hsn?: string
      tsn?: string
      brand?: { contains: string; mode: 'insensitive' }
      model?: { contains: string; mode: 'insensitive' }
      year?: number
    } = {}
    
    if (hsn) where.hsn = hsn
    if (tsn) where.tsn = tsn
    if (brand) where.brand = { contains: brand, mode: 'insensitive' }
    if (model) where.model = { contains: model, mode: 'insensitive' }
    if (year) where.year = parseInt(year)

    const vehicles = await prisma.vehicle.findMany({
      where,
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: vehicles,
    })
  } catch (error) {
    logger.error('Fehler bei der Fahrzeugsuche:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/vehicles/stats - Fahrzeug-Statistiken
async function _GET_STATS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const where = userId ? { userId } : {}

    const [
      totalVehicles,
      totalMileage,
      averageYear,
      brands,
      models,
    ] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.aggregate({
        where,
        _sum: { mileage: true },
      }),
      prisma.vehicle.aggregate({
        where,
        _avg: { year: true },
      }),
      prisma.vehicle.groupBy({
        where,
        by: ['brand'],
        _count: true,
        orderBy: { _count: { brand: 'desc' } },
        take: 10,
      }),
      prisma.vehicle.groupBy({
        where,
        by: ['model'],
        _count: true,
        orderBy: { _count: { model: 'desc' } },
        take: 10,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalVehicles,
        totalMileage: totalMileage._sum.mileage || 0,
        averageYear: Math.round(averageYear._avg.year || 0),
        topBrands: brands.map(b => ({ brand: b.brand, count: b._count })),
        topModels: models.map(m => ({ model: m.model, count: m._count })),
      },
    })
  } catch (error) {
    logger.error('Fehler beim Abrufen der Fahrzeug-Statistiken:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// Silence unused variable warnings
void { _GET_SEARCH, _GET_STATS };