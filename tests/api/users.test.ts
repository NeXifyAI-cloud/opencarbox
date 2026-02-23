import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const API_URL = 'http://localhost:3000/api/users'

describe('Users API', () => {
  beforeAll(async () => {
    // Testdaten bereinigen und erstellen
    await prisma.user.deleteMany()
    
    // Testbenutzer erstellen
    // @ts-expect-error createMany not available in SQLite test adapter

    await prisma.user.createMany({
      data: [
        {
          email: 'customer@test.com',
          name: 'Test Kunde',
          role: 'CUSTOMER',
        },
        {
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'ADMIN',
        },
        {
          email: 'employee@test.com',
          name: 'Test Mitarbeiter',
          role: 'EMPLOYEE',
        },
      ],
    })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('GET /api/users', () => {
    it('sollte alle Benutzer mit Pagination zurückgeben', async () => {
      const response = await fetch(API_URL)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(3)
      expect(data.pagination.total).toBe(3)
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(10)
    })

    it('sollte Filter nach Rolle unterstützen', async () => {
      const response = await fetch(`${API_URL}?role=CUSTOMER`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].role).toBe('CUSTOMER')
      expect(data.data[0].email).toBe('customer@test.com')
    })

    it('sollte Pagination-Parameter unterstützen', async () => {
      const response = await fetch(`${API_URL}?page=1&limit=2`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(2)
      expect(data.pagination.limit).toBe(2)
      expect(data.pagination.pages).toBe(2)
    })

    it('sollte sensible Daten ausblenden', async () => {
      const response = await fetch(API_URL)
      const data = await response.json()

      expect(response.status).toBe(200)
      
      // Prüfen dass nur erlaubte Felder zurückgegeben werden
      const user = data.data[0]
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('createdAt')
      expect(user).toHaveProperty('updatedAt')
      
      // Prüfen dass keine sensiblen Daten zurückgegeben werden
      expect(user).not.toHaveProperty('password')
      expect(user).not.toHaveProperty('passwordHash')
    })
  })

  describe('PUT /api/users', () => {
    it('sollte Benutzer erfolgreich aktualisieren', async () => {
      // Zuerst Benutzer-ID abrufen
      const users = await prisma.user.findMany()
      const userId = users[0].id

      const updateData = {
        name: 'Aktualisierter Name',
        role: 'ADMIN',
      }

      const response = await fetch(`${API_URL}?id=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toMatchObject({
        id: userId,
        name: updateData.name,
        role: updateData.role,
      })
      expect(data.data.email).toBeDefined() // Email sollte erhalten bleiben
    })

    it('sollte Validierungsfehler bei ungültigen Daten zurückgeben', async () => {
      const users = await prisma.user.findMany()
      const userId = users[0].id

      const invalidUpdate = {
        name: '', // Leerer Name
        role: 'invalid-role', // Ungültige Rolle
      }

      const response = await fetch(`${API_URL}?id=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidUpdate),
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Validierungsfehler')
      expect(data.details).toBeDefined()
    })

    it('sollte Fehler zurückgeben, wenn Benutzer-ID fehlt', async () => {
      const updateData = {
        name: 'Neuer Name',
      }

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Benutzer-ID ist erforderlich')
    })

    it('sollte 404 zurückgeben, wenn Benutzer nicht existiert', async () => {
      const nonExistentId = 'non-existent-id'

      const updateData = {
        name: 'Neuer Name',
      }

      const response = await fetch(`${API_URL}?id=${nonExistentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Benutzer nicht gefunden')
    })

    it('sollte Teilaktualisierungen unterstützen', async () => {
      const users = await prisma.user.findMany()
      const userId = users[1].id

      // Nur Name aktualisieren
      const updateData = {
        name: 'Nur Name geändert',
      }

      const response = await fetch(`${API_URL}?id=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(updateData.name)
      // Rolle sollte unverändert bleiben
      expect(data.data.role).toBe('ADMIN')
    })
  })
})