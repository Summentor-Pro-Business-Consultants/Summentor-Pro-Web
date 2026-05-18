/**
 * prisma.client.ts — Singleton Prisma client with PostgreSQL connection pooling
 *
 * WHY a singleton?
 * Prisma recommends keeping a single PrismaClient instance for the lifetime
 * of the process.  Creating multiple instances causes connection-pool
 * exhaustion — each instance opens its own pool of database connections.
 *
 * WHY the `globalForPrisma` trick?
 * In development, Next.js / ts-node reloads modules on every file change.
 * Each reload would normally create a fresh PrismaClient (and a new pool).
 * Storing the instance on the Node `global` object survives hot-reloads
 * in development.  In production we never reassign it, so there is no risk
 * of sharing state across requests.
 *
 * WHY `@prisma/adapter-pg` instead of the built-in driver?
 * The `pg` adapter uses the well-tested `node-postgres` library and gives
 * fine-grained control over pool configuration (size, idle timeout, SSL).
 * It is also required when deploying to environments that do not support
 * Prisma's native Rust-based driver (e.g. some serverless runtimes).
 *
 * Exports:
 *   prisma       — the shared PrismaClient instance (use this everywhere)
 *   connectDB()  — call once at app startup to verify the connection
 *   getPrismaClient() — defensive getter, useful in dependency-injected code
 */

import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

import { dbUrl } from "../../config.ts";
import { PrismaClient } from "../../generated/prisma/index.js";
import logger from "../logger/logger.service.ts";

// Store the client on `global` so it survives hot-module-reloads in dev.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Creates a new PrismaClient backed by a `pg.Pool` connection pool.
 *
 * This factory is only called once — either at process start (production) or
 * on the first module load in development.
 *
 * `ssl: { rejectUnauthorized: false }` is intentionally permissive so that
 * self-signed certificates used by many managed PostgreSQL providers
 * (e.g. Supabase, Railway) are accepted without extra CA configuration.
 * In a high-security environment you would supply the CA certificate instead.
 */
function createPrismaClient(): PrismaClient {
  // Build a pg connection pool — reuses TCP connections across queries,
  // which is far cheaper than opening a new connection per request.
  const pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  // Wrap the pool with the Prisma driver adapter so Prisma can issue
  // queries through `node-postgres` rather than its native driver.
  const adapter = new PrismaPg(pool);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter, log: ["error", "warn"] } as any);
}

/**
 * The application-wide Prisma client.
 *
 * In production:  always a freshly created instance (module evaluated once).
 * In development: reused from `global` if the module was already loaded,
 *                 preventing pool explosion on hot-reloads.
 */
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  // Pin the instance to `global` in dev/test so subsequent module reloads
  // pick it up instead of creating another pool.
  globalForPrisma.prisma = prisma;
}

/**
 * Connects to the database and registers graceful-shutdown handlers.
 *
 * Call this once during application startup (before handling any requests).
 * If the initial connection fails the process exits with code 1, which
 * signals the process manager (PM2, Docker, etc.) to restart the service.
 *
 * Graceful shutdown:
 *   SIGINT  — sent when the developer hits Ctrl+C in the terminal.
 *   SIGTERM — sent by Docker / Kubernetes when stopping the container.
 *   In both cases we disconnect Prisma cleanly so in-flight queries can
 *   finish and the connection pool is released before the process exits.
 */
export async function connectDB() {
  try {
    await prisma.$connect();
    logger.info("Prisma connected to PostgreSQL database");
  } catch (err) {
    logger.error("Prisma connection error");
    logger.error(err);
    // Exit immediately — there is no point running the server without a DB.
    process.exit(1);
  }

  // Gracefully close the pool when the OS asks the process to stop.
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    logger.info("Prisma disconnected due to app termination");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    logger.info("Prisma disconnected due to app termination");
    process.exit(0);
  });
}

/**
 * Returns the initialized Prisma client, throwing if it has not been set up.
 *
 * Prefer importing `prisma` directly; use this function only in code paths
 * where you want an explicit guard against calling the DB before `connectDB`
 * has been awaited (e.g. in CLI scripts or test setup helpers).
 *
 * @throws {Error} When the module-level `prisma` constant is falsy, which
 *                 should never happen in normal application flow.
 * @returns {PrismaClient} The singleton Prisma client.
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    throw new Error("Prisma client not initialized. Call connectDB() first.");
  }
  return prisma;
}
