import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  signupSchema,
  createOrderSchema,
  createProductSchema,
  createAppointmentSchema,
  emailSchema,
  passwordSchema,
} from '../schemas'

describe('Validation Schemas', () => {
  describe('Email Schema', () => {
    it('should accept valid email', () => {
      const result = emailSchema.safeParse('test@example.com')
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = emailSchema.safeParse('invalid-email')
      expect(result.success).toBe(false)
    })

    it('should lowercase email', () => {
      const result = emailSchema.safeParse('TEST@EXAMPLE.COM')
      expect(result.success).toBe(true)
      expect((result as any).data).toBe('test@example.com')
    })
  })

  describe('Password Schema', () => {
    it('should accept valid password', () => {
      const result = passwordSchema.safeParse('MyPassword123!')
      expect(result.success).toBe(true)
    })

    it('should reject password without uppercase', () => {
      const result = passwordSchema.safeParse('mypassword123!')
      expect(result.success).toBe(false)
    })

    it('should reject password without number', () => {
      const result = passwordSchema.safeParse('MyPassword!')
      expect(result.success).toBe(false)
    })

    it('should reject password without special character', () => {
      const result = passwordSchema.safeParse('MyPassword123')
      expect(result.success).toBe(false)
    })

    it('should reject password shorter than 8 characters', () => {
      const result = passwordSchema.safeParse('Pass1!')
      expect(result.success).toBe(false)
    })
  })

  describe('Login Schema', () => {
    it('should validate valid login', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'TestPassword123!',
      })
      expect(result.success).toBe(true)
    })

    it('should require email', () => {
      const result = loginSchema.safeParse({
        password: 'TestPassword123!',
      })
      expect(result.success).toBe(false)
    })

    it('should require password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Signup Schema', () => {
    it('should validate valid signup', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        name: 'John Doe',
        phone: '+4915211234567',
      })
      expect(result.success).toBe(true)
    })

    it('should reject mismatched passwords', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'DifferentPassword123!',
        name: 'John Doe',
      })
      expect(result.success).toBe(false)
    })

    it('should require minimum name length', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        name: 'J',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Create Order Schema', () => {
    it('should validate valid order', () => {
      const result = createOrderSchema.safeParse({
        items: [
          {
            productId: 'clhf9o8eg0000l708dxb2a8n9',
            quantity: 2,
          },
        ],
        billingAddressId: 'clhf9o8eg0000l708dxb2a8n9',
        shippingAddressId: 'clhf9o8eg0000l708dxb2a8n9',
      })
      expect(result.success).toBe(true)
    })

    it('should require at least one item', () => {
      const result = createOrderSchema.safeParse({
        items: [],
        billingAddressId: 'clhf9o8eg0000l708dxb2a8n9',
        shippingAddressId: 'clhf9o8eg0000l708dxb2a8n9',
      })
      expect(result.success).toBe(false)
    })

    it('should validate quantity constraints', () => {
      const result = createOrderSchema.safeParse({
        items: [
          {
            productId: 'clhf9o8eg0000l708dxb2a8n9',
            quantity: 0,
          },
        ],
        billingAddressId: 'clhf9o8eg0000l708dxb2a8n9',
        shippingAddressId: 'clhf9o8eg0000l708dxb2a8n9',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Create Product Schema', () => {
    it('should validate valid product', () => {
      const result = createProductSchema.safeParse({
        sku: 'PROD-001',
        name: 'Test Product',
        slug: 'test-product',
        price: 99.99,
        stock: 10,
        images: ['https://example.com/image.jpg'],
      })
      expect(result.success).toBe(true)
    })

    it('should require at least one image', () => {
      const result = createProductSchema.safeParse({
        sku: 'PROD-001',
        name: 'Test Product',
        slug: 'test-product',
        price: 99.99,
        stock: 10,
        images: [],
      })
      expect(result.success).toBe(false)
    })

    it('should validate SKU format', () => {
      const result = createProductSchema.safeParse({
        sku: 'invalid_sku',
        name: 'Test Product',
        slug: 'test-product',
        price: 99.99,
        stock: 10,
        images: ['https://example.com/image.jpg'],
      })
      expect(result.success).toBe(false)
    })

    it('should validate slug format', () => {
      const result = createProductSchema.safeParse({
        sku: 'PROD-001',
        name: 'Test Product',
        slug: 'test_product',
        price: 99.99,
        stock: 10,
        images: ['https://example.com/image.jpg'],
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Create Appointment Schema', () => {
    it('should validate valid appointment', () => {
      const futureDate = new Date()
      futureDate.setHours(futureDate.getHours() + 1)

      const result = createAppointmentSchema.safeParse({
        serviceId: 'clhf9o8eg0000l708dxb2a8n9',
        date: futureDate.toISOString(),
        timeSlot: '09:00-10:00',
        customerName: 'John Doe',
      })
      expect(result.success).toBe(true)
    })

    it('should reject past dates', () => {
      const pastDate = new Date()
      pastDate.setHours(pastDate.getHours() - 1)

      const result = createAppointmentSchema.safeParse({
        serviceId: 'clhf9o8eg0000l708dxb2a8n9',
        date: pastDate.toISOString(),
        timeSlot: '09:00-10:00',
      })
      expect(result.success).toBe(false)
    })

    it('should validate time slot format', () => {
      const futureDate = new Date()
      futureDate.setHours(futureDate.getHours() + 1)

      const result = createAppointmentSchema.safeParse({
        serviceId: 'clhf9o8eg0000l708dxb2a8n9',
        date: futureDate.toISOString(),
        timeSlot: 'invalid-time',
      })
      expect(result.success).toBe(false)
    })
  })
})
