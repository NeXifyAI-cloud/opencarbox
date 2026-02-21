const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Starte Prisma Test...');

  try {
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });

    console.log('Prisma Client erstellt');

    // Einfache Abfrage
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Ergebnis:', result);

    await prisma.$disconnect();
    console.log('✓ Test erfolgreich!');
  } catch (error) {
    console.error('✗ Fehler:', error.message);
    console.error('Stack:', error.stack);
  }
}

main();