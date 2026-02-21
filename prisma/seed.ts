import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starte Seeding der Datenbank...')

  // 1. Benutzer erstellen
  console.log('📝 Erstelle Benutzer...')
  void await prisma.user.create({
    data: {
      email: 'admin@opencarbox.at',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  const customerUser = await prisma.user.create({
    data: {
      email: 'kunde@example.com',
      name: 'Max Mustermann',
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  })

  // 2. Adressen erstellen
  console.log('🏠 Erstelle Adressen...')
  const address = await prisma.address.create({
    data: {
      userId: customerUser.id,
      type: 'SHIPPING',
      firstName: 'Max',
      lastName: 'Mustermann',
      street: 'Musterstraße',
      streetNumber: '123',
      postalCode: '1010',
      city: 'Wien',
      country: 'AT',
      isDefault: true,
    },
  })

  // 3. Fahrzeuge erstellen
  console.log('🚗 Erstelle Fahrzeuge...')
  const vehicle = await prisma.vehicle.create({
    data: {
      userId: customerUser.id,
      brand: 'Volkswagen',
      model: 'Golf',
      variant: 'VII GTI',
      year: 2020,
      licensePlate: 'W-ABC123',
      nickname: 'Mein Golf GTI',
      mileage: 45000,
    },
  })

  // 4. Kategorien erstellen
  console.log('📂 Erstelle Kategorien...')
  const mainCategory = await prisma.category.create({
    data: {
      name: 'Ersatzteile',
      slug: 'ersatzteile',
      description: 'Original Ersatzteile für alle Fahrzeuge',
      isActive: true,
      sortOrder: 1,
    },
  })

  const subCategory = await prisma.category.create({
    data: {
      name: 'Bremsen',
      slug: 'bremsen',
      description: 'Bremsbeläge, Bremsscheiben, Bremsflüssigkeit',
      parentId: mainCategory.id,
      isActive: true,
      sortOrder: 2,
    },
  })

  // 5. Produkte erstellen
  console.log('🛒 Erstelle Produkte...')
  const product1 = await prisma.product.create({
    data: {
      sku: 'CV-BR-001',
      name: 'Bremsscheiben Vorderachse VW Golf VII',
      slug: 'bremsscheiben-vorderachse-vw-golf-vii',
      description: 'Original Bremsscheiben für VW Golf VII, Vorderachse',
      price: 129.99,
      comparePrice: 159.99,
      costPrice: 89.99,
      stock: 25,
      lowStockAlert: 5,
      trackStock: true,
      images: 'https://example.com/bremsscheibe1.jpg,https://example.com/bremsscheibe2.jpg',
      categoryId: subCategory.id,
      brand: 'VW Original',
      isActive: true,
      isFeatured: true,
      metaTitle: 'Bremsscheiben VW Golf VII | Carvantooo',
      metaDescription: 'Original Bremsscheiben für VW Golf VII günstig kaufen',
    },
  })

  const product2 = await prisma.product.create({
    data: {
      sku: 'CV-BR-002',
      name: 'Bremsbeläge Vorderachse VW Golf VII',
      slug: 'bremsbelaege-vorderachse-vw-golf-vii',
      description: 'Original Bremsbeläge für VW Golf VII, Vorderachse',
      price: 79.99,
      comparePrice: 99.99,
      costPrice: 49.99,
      stock: 50,
      lowStockAlert: 10,
      trackStock: true,
      images: 'https://example.com/bremsbelag1.jpg,https://example.com/bremsbelag2.jpg',
      categoryId: subCategory.id,
      brand: 'VW Original',
      isActive: true,
      isFeatured: false,
    },
  })

  // 6. Produktvarianten erstellen
  console.log('🎨 Erstelle Produktvarianten...')
  await prisma.productVariant.create({
    data: {
      productId: product1.id,
      sku: 'CV-BR-001-S',
      name: 'Größe S',
      price: 119.99,
      stock: 10,
      attributes: JSON.stringify({ size: 'S', material: 'Stahl' }),
    },
  })

  await prisma.productVariant.create({
    data: {
      productId: product1.id,
      sku: 'CV-BR-001-M',
      name: 'Größe M',
      price: 129.99,
      stock: 15,
      attributes: JSON.stringify({ size: 'M', material: 'Stahl' }),
    },
  })

  // 7. Fahrzeug-Kompatibilität
  console.log('🔧 Erstelle Fahrzeug-Kompatibilität...')
  await prisma.vehicleCompatibility.create({
    data: {
      productId: product1.id,
      hsn: '0607',
      tsn: 'ABC',
      brand: 'Volkswagen',
      model: 'Golf',
      yearFrom: 2017,
      yearTo: 2020,
    },
  })

  // 8. Service-Kategorien
  console.log('🔧 Erstelle Service-Kategorien...')
  const serviceCategory = await prisma.serviceCategory.create({
    data: {
      name: 'Wartung',
      slug: 'wartung',
      description: 'Regelmäßige Wartungsarbeiten',
      sortOrder: 1,
    },
  })

  // 9. Services
  console.log('⚙️ Erstelle Services...')
  const service1 = await prisma.service.create({
    data: {
      categoryId: serviceCategory.id,
      name: 'Ölwechsel',
      slug: 'oelwechsel',
      description: 'Kompletter Ölwechsel inkl. Filter',
      priceFrom: 89.99,
      priceTo: 129.99,
      priceType: 'FROM',
      durationMinutes: 60,
      isActive: true,
    },
  })

  const service2 = await prisma.service.create({
    data: {
      categoryId: serviceCategory.id,
      name: 'Bremsenservice',
      slug: 'bremsenservice',
      description: 'Kompletter Bremsenservice inkl. Beläge und Scheiben prüfen',
      priceFrom: 149.99,
      priceTo: 299.99,
      priceType: 'FROM',
      durationMinutes: 120,
      isActive: true,
    },
  })

  // 10. Termine
  console.log('📅 Erstelle Termine...')
  await prisma.appointment.create({
    data: {
      userId: customerUser.id,
      vehicleId: vehicle.id,
      serviceId: service1.id,
      date: new Date('2024-12-15'),
      timeSlot: '09:00-10:00',
      customerName: 'Max Mustermann',
      customerEmail: 'kunde@example.com',
      customerPhone: '+43123456789',
      status: 'CONFIRMED',
      customerNote: 'Bitte Ölwechsel mit synthetischem Öl durchführen',
    },
  })

  // 11. Bestellung
  console.log('🛍️ Erstelle Bestellung...')
  const order = await prisma.order.create({
    data: {
      orderNumber: 'CV-2024-0001',
      userId: customerUser.id,
      vehicleId: vehicle.id,
      shippingAddressId: address.id,
      billingAddressId: address.id,
      subtotal: 209.98,
      shippingCost: 9.99,
      taxAmount: 41.99,
      discount: 0,
      total: 261.96,
      paymentMethod: 'credit_card',
      paymentStatus: 'PAID',
      status: 'PROCESSING',
      shippingMethod: 'standard',
      customerNote: 'Bitte zusammen mit der Bestellung CV-2024-0002 versenden',
    },
  })

  // 12. Bestellpositionen
  console.log('📦 Erstelle Bestellpositionen...')
  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: product1.id,
      sku: product1.sku,
      name: product1.name,
      price: product1.price,
      quantity: 1,
      total: product1.price,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: product2.id,
      sku: product2.sku,
      name: product2.name,
      price: product2.price,
      quantity: 1,
      total: product2.price,
    },
  })

  // 13. Bewertungen
  console.log('⭐ Erstelle Bewertungen...')
  await prisma.review.create({
    data: {
      userId: customerUser.id,
      productId: product1.id,
      rating: 5,
      title: 'Sehr gute Qualität',
      content: 'Perfekte Passform, einfache Montage, sehr zufrieden!',
      isVerified: true,
      isApproved: true,
    },
  })

  // 14. Project Memory (für AI-Agenten)
  console.log('🧠 Erstelle Project Memory...')
  await prisma.projectMemory.create({
    data: {
      type: 'BEST_PRACTICE',
      category: 'supabase',
      title: 'SQLite für lokale Entwicklung verwenden',
      content: 'Für lokale Entwicklung SQLite statt PostgreSQL verwenden, um Abhängigkeiten zu reduzieren.',
      metadata: JSON.stringify({ tags: ['development', 'database', 'local'] }),
      tags: 'development,database,local',
    },
  })

  // 15. Audit Logs
  console.log('📊 Erstelle Audit Logs...')
  await prisma.auditLog.create({
    data: {
      action: 'seed_database',
      resource: 'prisma/seed.ts',
      status: 'SUCCESS',
      details: JSON.stringify({
        tablesCreated: 15,
        recordsCreated: 20,
        timestamp: new Date().toISOString()
      }),
      durationMs: 5000,
    },
  })

  console.log('✅ Seeding abgeschlossen!')
  console.log(`📊 Erstellt: 15 Tabellen mit Testdaten`)
  console.log(`👤 Admin Login: admin@opencarbox.at`)
  console.log(`👤 Kunde Login: kunde@example.com`)
  console.log(`🛒 Produkte: ${product1.name}, ${product2.name}`)
  console.log(`🔧 Services: ${service1.name}, ${service2.name}`)
}

main()
  .catch((e) => {
    console.error('❌ Fehler beim Seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })