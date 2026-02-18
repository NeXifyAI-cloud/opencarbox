import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation Schema
const categorySchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  slug: z.string().min(1, 'Slug ist erforderlich'),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/categories - Alle Kategorien abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const onlyActive = searchParams.get('onlyActive') !== 'false'

    const where = onlyActive ? { isActive: true } : {}

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: true,
        parent: true,
        products: includeProducts ? {
          take: 10,
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        } : false,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
    })

    // Hierarchische Struktur erstellen
    type CategoryWithChildren = (typeof categories[number]) & { children: CategoryWithChildren[] }
    const buildHierarchy = (cats: typeof categories, parentId: string | null = null): CategoryWithChildren[] => {
      return cats
        .filter(category => category.parentId === parentId)
        .map(category => ({
          ...category,
          children: buildHierarchy(cats, category.id)
        }))
    }

    const hierarchicalCategories = buildHierarchy(categories)

    return NextResponse.json({
      success: true,
      data: hierarchicalCategories,
      flat: categories,
    })
  } catch (error) {
    console.error('Fehler beim Abrufen der Kategorien:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Neue Kategorie erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    const validation = categorySchema.safeParse(body)
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

    // Prüfen ob Slug bereits existiert
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validation.data.slug },
    })

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Kategorie mit diesem Slug existiert bereits' },
        { status: 409 }
      )
    }

    // Prüfen ob parentId existiert (falls angegeben)
    if (validation.data.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: validation.data.parentId },
      })

      if (!parentCategory) {
        return NextResponse.json(
          { success: false, error: 'Übergeordnete Kategorie existiert nicht' },
          { status: 404 }
        )
      }
    }

    // Kategorie erstellen
    const category = await prisma.category.create({
      data: validation.data,
      include: {
        parent: true,
        children: true,
      },
    })

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    )
  } catch (error) {
    console.error('Fehler beim Erstellen der Kategorie:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}