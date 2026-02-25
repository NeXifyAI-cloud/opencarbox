import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Validation Schema für Review
const reviewSchema = z.object({
  userId: z.string().min(1, 'Benutzer-ID ist erforderlich'),
  productId: z.string().optional().nullable(),
  rating: z.number().min(1, 'Bewertung muss mindestens 1 sein').max(5, 'Bewertung darf maximal 5 sein'),
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  isVerified: z.boolean().default(false),
  isApproved: z.boolean().default(false),
})

// GET /api/reviews - Alle Bewertungen abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')
    const rating = searchParams.get('rating')
    const isApproved = searchParams.get('isApproved')
    const isVerified = searchParams.get('isVerified')

    // Filter erstellen
    const where: {
      userId?: string
      productId?: string
      rating?: number
      isApproved?: boolean
      isVerified?: boolean
    } = {}
    
    if (userId) where.userId = userId
    if (productId) where.productId = productId
    if (rating) where.rating = parseInt(rating)
    if (isApproved !== null) where.isApproved = isApproved === 'true'
    if (isVerified !== null) where.isVerified = isVerified === 'true'

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
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
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error('Fehler beim Abrufen der Bewertungen:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Neue Bewertung erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    const validation = reviewSchema.safeParse(body)
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

    // Prüfen, ob der Benutzer das Produkt bereits bewertet hat
    if (validation.data.productId) {
      const existingReview = await prisma.review.findFirst({
        where: {
          userId: validation.data.userId,
          productId: validation.data.productId,
        },
      })

      if (existingReview) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Sie haben dieses Produkt bereits bewertet',
            details: { existingReviewId: existingReview.id }
          },
          { status: 409 }
        )
      }
    }

    // Bewertung erstellen
    const review = await prisma.review.create({
      data: validation.data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
      { success: true, data: review },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Fehler beim Erstellen der Bewertung:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/reviews/stats - Bewertungs-Statistiken
async function _GET_STATS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    const where = productId ? { productId } : {}

    const [
      totalReviews,
      averageRating,
      ratingDistribution,
      byProduct,
      recentReviews,
    ] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
      }),
      prisma.review.groupBy({
        where,
        by: ['rating'],
        _count: true,
        orderBy: { rating: 'desc' },
      }),
      prisma.review.groupBy({
        where,
        by: ['productId'],
        _avg: { rating: true },
        _count: true,
        orderBy: { _count: { productId: 'desc' } },
        take: 10,
      }),
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ])

    // Produkt-Namen für byProduct hinzufügen
    const productIds = byProduct.map(p => p.productId).filter(id => id !== null) as string[]
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    })

    const byProductWithNames = byProduct.map(product => ({
      ...product,
      productName: products.find(p => p.id === product.productId)?.name || 'Unbekannt',
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalReviews,
        averageRating: averageRating._avg.rating?.toFixed(1) || '0.0',
        ratingDistribution: ratingDistribution.map(r => ({ rating: r.rating, count: r._count })),
        byProduct: byProductWithNames,
        recentReviews,
      },
    })
  } catch (error) {
    logger.error('Fehler beim Abrufen der Bewertungs-Statistiken:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/reviews/product/:productId - Bewertungen für ein Produkt
async function _GET_PRODUCT_REVIEWS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const skip = (page - 1) * limit

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Produkt-ID ist erforderlich' },
        { status: 400 }
      )
    }

    const where = {
      productId,
      isApproved: true,
    }

    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: true,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        stats: {
          averageRating: stats._avg.rating?.toFixed(1) || '0.0',
          totalReviews: stats._count,
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    logger.error('Fehler beim Abrufen der Produkt-Bewertungen:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// Silence unused variable warnings
void { _GET_PRODUCT_REVIEWS, _GET_STATS };