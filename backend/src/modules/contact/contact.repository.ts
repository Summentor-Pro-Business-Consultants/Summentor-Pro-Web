/**
 * contact.repository.ts — Contact Module: Data Access Layer
 *
 * This file is the ONLY place in the contact module that talks to the database.
 * All functions here are thin wrappers around Prisma Client calls — they contain
 * zero business logic. Business rules (e.g. name formatting, error translation)
 * live in contact.service.ts instead.
 *
 * Why keep this separation?
 *   - Repositories are easy to unit-test by mocking `prisma`.
 *   - Swapping the ORM (e.g. from Prisma to Drizzle) only requires changing
 *     this file, leaving service and controller untouched.
 *   - It enforces a clear, auditable boundary: "if SQL is changing, look here."
 *
 * Every function returns a Prisma result type directly — callers are responsible
 * for interpreting the result (e.g. null vs. not-found error).
 */

import { prisma } from "../../infrastructure/db/prisma.client.ts";
import { getPagination } from "../../shared/utils/pagination.util.ts";

/**
 * Persists a new contact form submission to the database.
 *
 * Optional fields are coerced from `undefined` to `null` before being passed
 * to Prisma. This is necessary because Prisma's generated types expect `null`
 * for nullable columns — passing `undefined` would cause the field to be
 * omitted from the INSERT entirely rather than stored as NULL.
 *
 * @param data - Contact fields; optional string fields may be undefined.
 * @returns     The newly created ContactSubmission record.
 */
export async function createContact(data: {
  firstName: string;
  lastName: string;
  organisation: string;
  designation?: string | undefined;
  email: string;
  phone?: string | undefined;
  location?: string | undefined;
  industrySector: string;
  referralSource?: string | undefined;
  budget?: string | undefined;
  message?: string | undefined;
}) {
  return prisma.contactSubmission.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      organisation: data.organisation,
      // Prisma needs null, not undefined, for optional nullable columns
      designation: data.designation ?? null,
      email: data.email,
      phone: data.phone ?? null,
      location: data.location ?? null,
      industrySector: data.industrySector,
      referralSource: data.referralSource ?? null,
      budget: data.budget ?? null,
      message: data.message ?? null,
    },
  });
}

/**
 * Returns a paginated, optionally filtered list of contact submissions for the
 * admin dashboard, along with the total count for pagination metadata.
 *
 * The `where` clause is built dynamically so we only apply filters when the
 * caller actually passes them — omitting a filter key is more efficient than
 * passing an empty/undefined value that Prisma would still evaluate.
 *
 * @param page   - 1-based page number.
 * @param limit  - Number of records per page.
 * @param status - Optional status filter ('new' | 'reviewed' | 'replied').
 * @param search - Optional free-text search matched against name, email, and
 *                 organisation using a case-insensitive OR query.
 * @returns      `{ data: ContactSubmission[], total: number }`
 */
export async function listContacts(page: number, limit: number, status?: string, search?: string) {
  const { take, skip } = getPagination(page, limit);

  // Build the where clause incrementally to avoid passing undefined filter values
  const where: Record<string, unknown> = {};
  if (status) where["status"] = status;
  if (search) {
    // OR across multiple fields lets admins find a lead by any identifying detail
    where["OR"] = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { organisation: { contains: search, mode: "insensitive" } },
    ];
  }

  // Run the data fetch and count in parallel to halve the round-trip time
  const [data, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactSubmission.count({ where }),
  ]);
  return { data, total };
}

/**
 * Updates the workflow status of a single contact submission.
 *
 * @param id     - UUID of the ContactSubmission record.
 * @param status - New status value; must be one of the valid enum values.
 * @returns      The updated ContactSubmission record.
 */
export async function updateContactStatus(id: string, status: string) {
  return prisma.contactSubmission.update({ where: { id }, data: { status } });
}

/**
 * Hard-deletes a contact submission by its ID.
 * If the record does not exist, Prisma throws a P2025 error — the service layer
 * catches this and converts it into a user-friendly NotFoundError.
 *
 * @param id - UUID of the ContactSubmission record to remove.
 * @returns  The deleted ContactSubmission record.
 */
export async function deleteContact(id: string) {
  return prisma.contactSubmission.delete({ where: { id } });
}
