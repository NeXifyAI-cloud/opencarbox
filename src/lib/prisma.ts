import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton.
 * Verhindert Mehrfachentitäten des Clients während des Hot-Reloadings in der Entwicklung.
 */
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  let prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
