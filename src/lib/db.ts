import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { serverEnv } from "@/env.server";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: serverEnv.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const db = globalThis.prismaGlobal ?? createPrismaClient();

if (serverEnv.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}
