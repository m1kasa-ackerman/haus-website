import { PrismaClient } from '@prisma/client';

// Singleton pattern: in dev, Next.js hot-reloads modules and would otherwise
// create a new PrismaClient on every reload until the connection pool is
// exhausted. Reusing a global instance avoids that.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
