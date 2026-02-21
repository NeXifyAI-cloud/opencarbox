import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const API_URL = 'http://localhost:3000/api/orders'

describe('Orders API', () => {
  beforeAll(async () => {
    // Testdaten bereinigen
    await prisma.order.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('GET /api/orders', () => {
    it('sollte leere Liste zurückgeben, wenn keine Bestellungen existieren', async () => {
      const response = await fetch(API_URL)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
      expect(data.pagination.total).toBe(0)
    })

    it('sollte Bestellungen mit Pagination zurückgeben', async () => {
      // Testdaten erstellen (einzeln, da SQLite kein createMany unterstützt)
      await prisma.order.create({
        data: {
          orderNumber: 'CV-TEST-0001', userId: 'user-001',
          subtotal: 99.99, total: 99.99, status: 'PENDING',
        },
      })
      await prisma.order.create({
        data: {
          orderNumber: 'CV-TEST-0002', userId: 'user-002',
          subtotal: 149.99, total: 149.99, status: 'PROCESSING',
        },
      })

      const response = await fetch(API_URL)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(2)
      expect(data.pagination.total).toBe(2)
    })

    it('sollte Filter nach Status unterstützen', async () => {
      const response = await fetch(`${API_URL}?status=PENDING`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.every((order: any) => order.status === 'PENDING')).toBe(true)
    })

    it('sollte Filter nach UserId unterstützen', async () => {
      const response = await fetch(`${API_URL}?userId=user-001`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.every((order: any) => order.userId === 'user-001')).toBe(true)
    })
  })

  describe('POST /api/orders', () => {
    it('sollte neue Bestellung erfolgreich erstellen', async () => {
      const newOrder = {
        orderNumber: 'CV-TEST-0003',
        userId: 'test-user',
        subtotal: 199.99,
        total: 199.99,
        status: 'PENDING',
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toMatchObject({
        userId: newOrder.userId,
        total: newOrder.total,
        status: newOrder.status,
      })
      expect(data.data.id).toBeDefined()
      expect(data.data.createdAt).toBeDefined()
    })

    it('sollte Bestellung ohne UserId erstellen können', async () => {
      const newOrder = {
        orderNumber: 'CV-TEST-0004',
        subtotal: 99.99,
        total: 99.99,
        // Keine userId - optional
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.total).toBe(newOrder.total)
      expect(data.data.userId).toBeNull()
    })

    it('sollte Validierungsfehler bei ungültigen Daten zurückgeben', async () => {
      const invalidOrder = {
        total: -10, // Negativer Betrag
        status: 'invalid-status', // Ungültiger Status
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidOrder),
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Validierungsfehler')
      expect(data.details).toBeDefined()
    })

    it('sollte Standard-Status "pending" verwenden', async () => {
      const newOrder = {
        orderNumber: 'CV-TEST-0005',
        subtotal: 50.00,
        total: 50.00,
        // Kein Status angegeben
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.data.status).toBe('PENDING')
    })
  })
})