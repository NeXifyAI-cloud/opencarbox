#!/usr/bin/env npx tsx
/**
 * Test Database Connection
 * Testet die Prisma-Verbindung über den Connection Pooler
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Teste Datenbankverbindung...')
  console.log('   URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'))

  try {
    await prisma.$connect()
    console.log('✅ Prisma Verbindung erfolgreich!')

    // Test query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Test-Query erfolgreich:', result)

    // Count tables
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    ` as { tablename: string }[]
    console.log('📊 Verfügbare Tabellen:', tables.map(t => t.tablename).join(', '))

  } catch (error) {
    console.error('❌ Fehler:', (error as Error).message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
