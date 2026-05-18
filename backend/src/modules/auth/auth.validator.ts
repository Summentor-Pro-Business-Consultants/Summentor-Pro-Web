/**
 * auth.validator.ts — Input validation schemas for the auth module
 *
 * Zod schemas are the single source of truth for what valid auth request
 * bodies look like.  Defining them here (rather than inline in the controller)
 * means the same schema can be reused in tests, documentation generators,
 * and any future gRPC / tRPC transport layer.
 *
 * The inferred TypeScript types (`LoginInput`) are exported alongside the
 * schemas so service and controller functions get compile-time type safety
 * without duplicating the type definition.
 *
 * WHY Zod?
 * Zod validates and *parses* in one step: `schema.parse(value)` throws a
 * `ZodError` (caught by our error middleware) and `schema.safeParse(value)`
 * returns a discriminated union — no need for a separate type-casting step.
 * It also infers TypeScript types from the schema, keeping runtime validation
 * and compile-time types in sync automatically.
 */

import z from "zod";

/**
 * Validation schema for the login request body.
 *
 * Constraints:
 *   - `email`    must be a syntactically valid email address.  We use the
 *                standalone `z.email()` format type (Zod v4 idiom) rather
 *                than `z.string().email()`, which is marked @deprecated in
 *                Zod v4 — both validate identically at runtime.
 *   - `password` must be at least 1 character — intentionally minimal because
 *                the real strength check happened when the password was set;
 *                here we only want to reject clearly empty submissions.
 */
export const loginSchema = z.object({
  // z.email() is the Zod v4 canonical form; equivalent to the deprecated z.string().email()
  email: z.email(),
  password: z.string().min(1),
});

/**
 * TypeScript type extracted directly from `loginSchema`.
 *
 * We use `z.output<>` (the Zod v4 canonical helper) rather than the
 * deprecated `z.infer<>` alias.  Both produce the same type at compile time;
 * `z.output` is explicit about the fact that we want the *output* (parsed)
 * shape rather than the input shape (which may differ when coercions are used).
 *
 * Import this type in service and controller functions to avoid duplicating
 * the shape: `async function login(input: LoginInput, res: Response) { ... }`
 */
export type LoginInput = z.output<typeof loginSchema>;
