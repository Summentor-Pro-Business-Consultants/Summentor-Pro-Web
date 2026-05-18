/**
 * prisma.config.ts — Prisma configuration file for the Summentor Pro backend
 *
 * This file is the entry point that the Prisma CLI reads when you run
 * commands such as `prisma migrate dev`, `prisma generate`, or
 * `prisma studio`.  It uses the newer `defineConfig` API (introduced in
 * Prisma v5) instead of the legacy `schema.prisma` `datasource` block,
 * which allows the configuration to live in TypeScript and inherit
 * environment variables at CLI time.
 *
 * `dotenv/config` is imported as a side-effect so that `.env` is loaded
 * before `process.env.DATABASE_URL` is read.  This means you do NOT need
 * to pass `--env-file` to every Prisma CLI invocation.
 *
 * The fallback to an empty string (`?? ''`) prevents a crash when
 * DATABASE_URL is missing — Prisma will still report a descriptive error
 * rather than a generic "cannot read property of undefined" exception.
 */

import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  datasource: {
    // Read the connection string from the environment so credentials
    // are never hard-coded in source control.
    url: process.env.DATABASE_URL ?? "",
  },
});
