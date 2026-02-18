import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation Schema für Appointment
const appointmentSchema = z.object({
  userId: z.string().optional().nullable(),
  vehicleId: z.string().optional().nullable(),
  serviceId: z.string().min(1, 'Service-ID ist erforderlich'),
  date: z.string().datetime('Ungültiges Datumsformat'),
  timeSlot: z.string().min(1, 'Zeitslot ist erforderlich'),
  customerName: z.string().optional().nullable(),
  customerEmail: z.string().email('Ungültige E-Mail-Adresse').optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).default('PENDING'),
  customerNote: z.string().optional().nullable(),
  internalNote: z.string().optional().nullable(),
})

// GET /api/appointments - Alle Termine abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const userId = searchParams.get('userId')
    const vehicleId = searchParams.get('vehicleId')
    const serviceId = searchParams.get('serviceId')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Filter erstellen
    const where: {
      userId?: string
      vehicleId?: string
      serviceId?: string
      status?: string
      date?: {
        gte?: Date
        lte?: Date
      }
    } = {}
    
    if (userId) where.userId = userId
    if (vehicleId) where.vehicleId = vehicleId
    if (serviceId) where.serviceId = serviceId
    if (status) where.status = status
    
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) where.date.gte = new Date(dateFrom)
      if (dateTo) where.date.lte = new Date(dateTo)
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              brand: true,
              model: true,
              licensePlate: true,
            },
          },
          service: true,
        },
      }),
      prisma.appointment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error('Fehler beim Abrufen der Termine:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Neuen Termin erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    const validation = appointmentSchema.safeParse(body)
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
    const appointmentData = {
      ...validation.data,
      date: new Date(validation.data.date),
    }

    // Prüfen, ob der Termin verfügbar ist
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: appointmentData.date,
        timeSlot: appointmentData.timeSlot,
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
        },
      },
    })

    if (existingAppointment) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Termin bereits vergeben',
          details: { 
            existingAppointmentId: existingAppointment.id,
            date: existingAppointment.date,
            timeSlot: existingAppointment.timeSlot,
          }
        },
        { status: 409 }
      )
    }

    // Termin erstellen
    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            licensePlate: true,
          },
        },
        service: true,
      },
    })

    return NextResponse.json(
      { success: true, data: appointment },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Fehler beim Erstellen des Termins:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/appointments/availability - Verfügbarkeit prüfen
async function _GET_AVAILABILITY(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')

    if (!date || !serviceId) {
      return NextResponse.json(
        { success: false, error: 'Datum und Service-ID sind erforderlich' },
        { status: 400 }
      )
    }

    // Service-Details abrufen
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service nicht gefunden' },
        { status: 404 }
      )
    }

    // Bereits gebuchte Termine für das Datum
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: new Date(date + 'T00:00:00'),
          lte: new Date(date + 'T23:59:59'),
        },
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
        },
      },
      select: {
        timeSlot: true,
      },
    })

    // Standard-Zeitslots (kann später konfigurierbar gemacht werden)
    const allTimeSlots = [
      '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00',
    ]

    // Verfügbare Slots berechnen
    const bookedSlots = bookedAppointments.map(a => a.timeSlot)
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot))

    return NextResponse.json({
      success: true,
      data: {
        date,
        service,
        availableSlots,
        bookedSlots,
        totalSlots: allTimeSlots.length,
        availableCount: availableSlots.length,
      },
    })
  } catch (error) {
    logger.error('Fehler beim Prüfen der Verfügbarkeit:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/appointments/stats - Termin-Statistiken
async function _GET_STATS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: {
      date?: {
        gte?: Date
        lte?: Date
      }
    } = {}
    
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) where.date.gte = new Date(dateFrom)
      if (dateTo) where.date.lte = new Date(dateTo)
    }

    const [
      totalAppointments,
      byStatus,
      byService,
      byDay,
      upcoming,
    ] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.groupBy({
        where,
        by: ['status'],
        _count: true,
      }),
      prisma.appointment.groupBy({
        where,
        by: ['serviceId'],
        _count: true,
        orderBy: { _count: { serviceId: 'desc' } },
        take: 10,
      }),
      prisma.appointment.groupBy({
        where,
        by: ['date'],
        _count: true,
        orderBy: { date: 'asc' },
        take: 30,
      }),
      prisma.appointment.count({
        where: {
          ...where,
          date: {
            gte: new Date(),
          },
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
        },
      }),
    ])

    // Service-Namen für byService hinzufügen
    const serviceIds = byService.map(s => s.serviceId)
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true },
    })

    const byServiceWithNames = byService.map(service => ({
      ...service,
      serviceName: services.find(s => s.id === service.serviceId)?.name || 'Unbekannt',
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalAppointments,
        byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
        byService: byServiceWithNames,
        byDay: byDay.map(d => ({ date: d.date, count: d._count })),
        upcoming,
      },
    })
  } catch (error) {
    logger.error('Fehler beim Abrufen der Termin-Statistiken:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// Silence unused variable warnings
void { _GET_AVAILABILITY, _GET_STATS };