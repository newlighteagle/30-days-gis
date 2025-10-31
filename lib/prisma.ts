import { PrismaClient } from "@prisma/client";

declare global {
  // Tambahkan properti prisma ke globalThis
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ?? new PrismaClient({ log: ["query", "error", "warn"] });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
