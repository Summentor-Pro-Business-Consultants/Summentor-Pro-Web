/**
 * contact.service.ts — Contact Module: Business Logic Layer
 *
 * This file sits between the HTTP controller and the data-access repository.
 * Its job is to enforce business rules and orchestrate repository calls —
 * keeping both the controller (which should only care about HTTP) and the
 * repository (which should only care about SQL) free of domain logic.
 *
 * Responsibilities of this layer:
 *   - Transforming / normalising input before it reaches the database
 *     (e.g. converting names to Title Case for consistent display).
 *   - Translating low-level database errors (Prisma P2025 "record not found")
 *     into domain-level errors (NotFoundError) that the global error handler
 *     knows how to convert into HTTP responses.
 *   - Acting as the integration point if future logic requires sending emails,
 *     triggering webhooks, or writing to multiple tables in a transaction.
 *
 * All functions here are thin today, but the layer is intentionally kept so
 * that adding logic later does not require touching the controller or repository.
 */

import { NotFoundError } from "../../shared/errors/api-error.class.ts";
import { toTitleCase } from "../../shared/utils/string.util.ts";
import * as contactRepo from "./contact.repository.ts";
import type { ContactInput } from "./contact.validator.ts";

/**
 * Handles a new contact form submission end-to-end.
 *
 * Names are converted to Title Case before persistence so the data looks
 * consistent in the admin dashboard regardless of how the user typed them
 * (e.g. "john doe" → "John Doe").
 *
 * @param input - Validated contact form data (see ContactInput type).
 * @returns     The newly created ContactSubmission record.
 */
export async function submitContact(input: ContactInput) {
  return contactRepo.createContact({
    ...input,
    // Normalise name casing before storing so admin views are always consistent
    firstName: toTitleCase(input.firstName),
    lastName: toTitleCase(input.lastName),
  });
}

/**
 * Retrieves a paginated list of contact submissions for the admin dashboard.
 * Delegates entirely to the repository; no extra transformation is needed here.
 *
 * @param page   - 1-based page number.
 * @param limit  - Records per page (capped upstream in the controller).
 * @param status - Optional status filter.
 * @param search - Optional free-text search string.
 * @returns      `{ data: ContactSubmission[], total: number }`
 */
export async function listContacts(page: number, limit: number, status?: string, search?: string) {
  return contactRepo.listContacts(page, limit, status, search);
}

/**
 * Updates the workflow status of a contact submission.
 * The allowed status values are enforced by the Zod schema upstream, so no
 * additional validation is needed here.
 *
 * @param id     - UUID of the submission to update.
 * @param status - New status string.
 * @returns      The updated ContactSubmission record.
 */
export async function updateStatus(id: string, status: string) {
  return contactRepo.updateContactStatus(id, status);
}

/**
 * Deletes a contact submission by ID.
 *
 * Prisma throws a generic error when trying to delete a record that does not
 * exist (P2025). We catch any error and re-throw as NotFoundError so the global
 * error handler can return a clean 404 response instead of a 500.
 *
 * @param id - UUID of the submission to delete.
 * @throws   NotFoundError if no record with the given ID exists.
 */
export async function deleteContact(id: string) {
  try {
    await contactRepo.deleteContact(id);
  } catch {
    // Prisma P2025 ("Record to delete does not exist") lands here
    throw new NotFoundError("Contact not found");
  }
}
