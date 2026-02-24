import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Teste Datenbankverbindung...');
  const dbUrl = process.env.DATABASE_URL;
  console.log('   URL:', dbUrl ? dbUrl.replace(/:[^:@]+@/, ':***@') : 'MISSING');

  try {
    await prisma.$connect();
    console.log('✅ Prisma Verbindung erfolgreich!');

    // Test query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Test-Query erfolgreich:', result);

    // Count tables
    try {
      const tables = await prisma.$queryRaw`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      ` as { tablename: string }[];
      console.log('📊 Verfügbare Tabellen:', tables.map(t => t.tablename).join(', '));
    } catch (e) {
      console.log('ℹ️ Konnte Tabellen nicht auflisten (vielleicht keine PG Datenbank):', (e as Error).message);
    }

  } catch (error) {
    console.error('❌ Fehler:', (error as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
