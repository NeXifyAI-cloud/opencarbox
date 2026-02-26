import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Validation Schema für User Updates
const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').optional(),
  role: z.enum(['CUSTOMER', 'EMPLOYEE', 'ADMIN']).optional(),
})

// GET /api/users - Alle Benutzer abrufen (mit Pagination)
export async function GET(request: NextRequest) {
  try {
    // Sicherheit: Nur Admins dürfen die Benutzerliste sehen
    const userRole = request.headers.get('x-user-role')
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Nicht autorisiert' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const role = searchParams.get('role')

    const VALID_ROLES = ['CUSTOMER', 'EMPLOYEE', 'ADMIN']
    // Filter erstellen
    const where: {
      role?: string
    } = {}
    if (role) {
      const roleUpper = role.toUpperCase()
      if (VALID_ROLES.includes(roleUpper)) {
        where.role = roleUpper
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: users,
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

// PUT /api/users - Benutzer aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('id')
    
    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Benutzer-ID ist erforderlich' },
        { status: 400 }
      )
    }

    // Sicherheit: Nur Admins oder der Benutzer selbst dürfen aktualisieren
    const currentUserId = request.headers.get('x-user-id')
    const currentUserRole = request.headers.get('x-user-role')

    if (currentUserRole !== 'ADMIN' && targetUserId !== currentUserId) {
      return NextResponse.json(
        { success: false, error: 'Nicht autorisiert' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Sicherheit: Rollenänderungen nur durch Admins zulassen
    if (currentUserRole !== 'ADMIN' && body.role) {
      delete body.role
    }

    // Validierung
    const validation = userUpdateSchema.safeParse(body)
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

    // Prüfen ob Benutzer existiert
    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    // Benutzer aktualisieren
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: validation.data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {

    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}