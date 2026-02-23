import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const API_URL = 'http://localhost:3000/api/products'

describe('Products API', () => {
  beforeAll(async () => {
    // Testdaten bereinigen
    await prisma.product.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('GET /api/products', () => {
    it('sollte leere Liste zurückgeben, wenn keine Produkte existieren', async () => {
      const response = await fetch(API_URL)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
      expect(data.pagination.total).toBe(0)
    })

    it('sollte Produkte mit Pagination zurückgeben', async () => {
      // Testdaten erstellen
      await prisma.product.create({
        data: { sku: 'TEST-001', name: 'Test Produkt 1', slug: 'test-produkt-1', images: '', description: 'Beschreibung 1', price: 99.99, stock: 10 },
      })
      await prisma.product.create({
        data: { sku: 'TEST-002', name: 'Test Produkt 2', slug: 'test-produkt-2', images: '', description: 'Beschreibung 2', price: 149.99, stock: 5 },
      })

      const response = await fetch(API_URL)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(2)
      expect(data.pagination.total).toBe(2)
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(10)
    })

    it('sollte Pagination-Parameter unterstützen', async () => {
      const response = await fetch(`${API_URL}?page=1&limit=1`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      expect(data.pagination.limit).toBe(1)
    })
  })

  describe('POST /api/products', () => {
    it('sollte neues Produkt erfolgreich erstellen', async () => {
      const newProduct = {
        sku: 'NEW-001',
        name: 'Neues Produkt',
        slug: 'neues-produkt',
        description: 'Test Beschreibung',
        price: 199.99,
        stock: 20,
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toMatchObject({
        sku: newProduct.sku,
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
      })
      expect(data.data.id).toBeDefined()
      expect(data.data.createdAt).toBeDefined()
    })

    it('sollte Validierungsfehler bei ungültigen Daten zurückgeben', async () => {
      const invalidProduct = {
        sku: '', // Leerer SKU
        name: '', // Leerer Name
        slug: '', // Leerer Slug
        price: -10, // Negativer Preis
        stock: -5, // Negativer Lagerbestand
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidProduct),
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Validierungsfehler')
      expect(data.details).toBeDefined()
    })

    it('sollte Konflikt bei doppelter SKU zurückgeben', async () => {
      const duplicateProduct = {
        sku: 'NEW-001', // Bereits existierende SKU
        name: 'Anderes Produkt',
        slug: 'anderes-produkt',
        price: 299.99,
        stock: 15,
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateProduct),
      })

      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Produkt mit dieser SKU existiert bereits')
    })
  })
})