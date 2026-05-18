import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../infrastructure/db/prisma.client.ts";

async function main() {
  const email = process.env["SEED_EMAIL"] ?? "admin@summentorpro.com";
  const password = process.env["SEED_PASSWORD"] ?? "Admin@1234!";
  const name = process.env["SEED_NAME"] ?? "Admin";

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.adminUser.create({
    data: { email, passwordHash, name },
  });

  console.log(`Admin user created:`);
  console.log(`  ID:    ${admin.id}`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Name:  ${admin.name}`);
  console.log(`\nLogin with: ${email} / ${password}`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
