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

/** The one Prisma client, created the first time a query needs it (kept across dev hot reloads). */
function getPrismaClient(): PrismaClient {
  if (globalThis.prismaGlobal) return globalThis.prismaGlobal;
  const client = createPrismaClient();
  // Reused across hot reloads in dev; in production each server instance just keeps its own.
  globalThis.prismaGlobal = client;
  return client;
}

/**
 * The database client, connected on first use rather than at import.
 *
 * `next build` imports every route module while collecting page data. Creating the client (and
 * reading DATABASE_URL) at import meant a build with no database config failed outright, even
 * though a build never runs a query. Creating it lazily changes nothing at request time: the
 * first `db.x.findMany(...)` connects exactly as before, and a missing DATABASE_URL still fails
 * that request loudly.
 */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, key) {
    let client: PrismaClient;
    try {
      client = getPrismaClient();
    } catch (error) {
      return failedQuery(error);
    }
    const value = Reflect.get(client, key, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/**
 * Stands in for a model or method when the client couldn't be created (for example DATABASE_URL
 * is missing): any call returns a promise rejected with that same error. So a config problem
 * fails the query the same way a lost connection does, and code that already handles failed
 * queries (`.catch()`, try/await) handles it too, instead of a synchronous throw slipping past
 * it. Nothing is swallowed: an unhandled call still rejects with the original error.
 */
function failedQuery(error: unknown): unknown {
  const reject = () => Promise.reject(error);
  return new Proxy(reject, {
    get: () => failedQuery(error),
    apply: reject,
  });
}
