import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node --experimental-strip-types prisma/seed.ts",
  },
  datasource: {
    // Migrations run against Neon's direct (unpooled) connection. The app
    // runtime uses the pooled DATABASE_URL via the pg adapter in src/lib/db.ts.
    //
    // Read straight from process.env rather than the strict env() helper:
    // env() throws if the var is unset at all, which broke `prisma generate`
    // in Vercel's install step (generate doesn't need a real connection, but
    // config loading happens before any command-specific logic runs, so a
    // throw here blocked every deploy until DIRECT_URL was set). Only
    // migrate/db push/studio actually need this value, and they already give
    // a clear, specific error if it's missing when it matters.
    url: process.env.DIRECT_URL,
  },
});
