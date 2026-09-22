import "dotenv/config";

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

/**
 * Interactive CLI to create the first SUPER_ADMIN staff account. Never
 * accepts a password as a CLI arg or hardcodes one, per CLAUDE.md section 9
 * ("First super admin created via a CLI seed script, never a hardcoded
 * password"). Run with: pnpm seed:admin
 *
 * The Account row this writes (providerId "credential", accountId set to
 * the new user's id) is a best-effort match for Better Auth's expected
 * shape. Verify and adjust against Better Auth's own schema once auth is
 * actually wired up in Milestone 1C.
 */

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const db = new PrismaClient({ adapter });

const rl = createInterface({ input: stdin, output: stdout });

// Byte codes for the control keys we care about, spelled out numerically so
// no unprintable control characters need to live in this source file.
const KEYCODE_LF = 10;
const KEYCODE_CR = 13;
const KEYCODE_CTRL_C = 3;
const KEYCODE_BACKSPACE = 8;
const KEYCODE_DEL = 127;

async function askMasked(question: string): Promise<string> {
  return new Promise((resolve) => {
    let value = "";
    stdout.write(question);

    const onData = (chunk: Buffer) => {
      const code = chunk[0];

      if (code === KEYCODE_LF || code === KEYCODE_CR) {
        stdin.removeListener("data", onData);
        stdin.setRawMode?.(false);
        stdout.write("\n");
        resolve(value);
        return;
      }

      if (code === KEYCODE_CTRL_C) {
        stdin.setRawMode?.(false);
        stdout.write("\n");
        process.exit(130);
      }

      if (code === KEYCODE_BACKSPACE || code === KEYCODE_DEL) {
        value = value.slice(0, -1);
      } else {
        value += chunk.toString("utf8");
      }

      stdout.clearLine(0);
      stdout.cursorTo(0);
      stdout.write(question + "*".repeat(value.length));
    };

    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function main() {
  console.log("Vic Cameleers: create the first SUPER_ADMIN account.\n");

  let email = "";
  while (!isValidEmail(email)) {
    email = (await rl.question("Admin email: ")).trim();
    if (!isValidEmail(email)) console.log("That doesn't look like a valid email, try again.");
  }

  const name = (await rl.question("Admin full name: ")).trim();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    const overwrite = (
      await rl.question(`A user with ${email} already exists. Reset their password? (y/N): `)
    )
      .trim()
      .toLowerCase();
    if (overwrite !== "y") {
      console.log("Aborted, no changes made.");
      return;
    }
  }

  let password = "";
  while (password.length < 12) {
    password = await askMasked("Password (min 12 characters): ");
    if (password.length < 12) console.log("Too short, try again.");
  }
  const confirm = await askMasked("Confirm password: ");
  if (confirm !== password) {
    console.log("Passwords did not match. Aborted, no changes made.");
    return;
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

  const user = await db.user.upsert({
    where: { email },
    update: { name, role: "SUPER_ADMIN", isActive: true },
    create: {
      email,
      name,
      role: "SUPER_ADMIN",
      emailVerified: true,
      isActive: true,
    },
  });

  await db.account.upsert({
    where: { providerId_accountId: { providerId: "credential", accountId: user.id } },
    update: { password: passwordHash },
    create: {
      userId: user.id,
      providerId: "credential",
      accountId: user.id,
      password: passwordHash,
    },
  });

  console.log(`\nDone. ${email} can now sign in as SUPER_ADMIN once admin login is built.`);
  console.log("Set up TOTP 2FA on first login, it's mandatory for all staff accounts.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await db.$disconnect();
  });
