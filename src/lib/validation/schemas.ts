import { z } from 'zod'

// Reusable base validators
export const emailSchema = z.string().email('Invalid email address').toLowerCase()

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[!@#$%^&*]/, 'Password must contain special character')

export const phoneSchema = z
  .string()
  .regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    'Invalid phone number'
  )
  .optional()

// Form schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: phoneSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const passwordResetSchema = z.object({
  email: emailSchema,
})

export const passwordResetConfirmSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Order schemas
export const orderItemSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(999),
  variantId: z.string().cuid().optional(),
})

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item required'),
  billingAddressId: z.string().cuid('Invalid billing address'),
  shippingAddressId: z.string().cuid('Invalid shipping address'),
  couponCode: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
})

// Product schemas
export const createProductSchema = z.object({
  sku: z.string().min(3).max(50).regex(/^[A-Z0-9-]+$/, 'Invalid SKU format'),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Invalid slug'),
  description: z.string().max(5000).optional(),
  price: z.number().min(0).max(999999),
  comparePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0),
  trackStock: z.boolean().default(true),
  categoryId: z.string().cuid().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image required'),
  isActive: z.boolean().default(true),
})

export const updateProductSchema = createProductSchema.partial()

// Appointment schemas
export const createAppointmentSchema = z.object({
  serviceId: z.string().cuid('Invalid service ID'),
  date: z
    .string()
    .datetime('Invalid date format')
    .refine((date) => new Date(date) > new Date(), 'Date must be in the future'),
  timeSlot: z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Invalid time format'),
  vehicleId: z.string().cuid().optional(),
  customerName: z.string().min(2).optional(),
  customerEmail: emailSchema.optional(),
  customerPhone: phoneSchema,
  notes: z.string().max(1000).optional(),
})

// Address schemas
export const addressSchema = z.object({
  street: z.string().min(5).max(255),
  city: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
  country: z.string().min(2).max(100),
  state: z.string().max(100).optional(),
  isDefault: z.boolean().default(false),
})

export const createAddressSchema = addressSchema.extend({
  label: z.string().min(1).max(50),
})

// Vehicle schemas
export const createVehicleSchema = z.object({
  licensePlate: z.string().min(1).max(20).regex(/^[A-Z0-9-]+$/, 'Invalid license plate'),
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().min(10).max(20).optional(),
  notes: z.string().max(1000).optional(),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type CreateAddressInput = z.infer<typeof createAddressSchema>
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>
