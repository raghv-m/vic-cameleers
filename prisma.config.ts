import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node --experimental-strip-types prisma/seed.ts",
  },
  datasource: {
    // Migrations run against Neon's direct (unpooled) connection. The app
    // runtime uses the pooled DATABASE_URL via the pg adapter in src/lib/db.ts.
    url: env("DIRECT_URL"),
  },
});
