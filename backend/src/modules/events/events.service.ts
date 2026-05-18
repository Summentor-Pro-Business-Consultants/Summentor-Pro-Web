/**
 * events.service.ts — Events Module: Business Logic Layer
 *
 * This file orchestrates all business rules for the events module. It sits
 * between the HTTP controller (events.controller.ts) and the raw Prisma queries
 * (events.repository.ts), and is the correct place to add logic such as:
 *
 *   - Validating that an event exists before allowing registration.
 *   - Converting ISO date strings to Date objects (required by Prisma).
 *   - Normalising user-provided names to Title Case.
 *   - Translating database-level "record not found" errors (Prisma P2025) into
 *     domain-level NotFoundError so the global handler returns clean 404s.
 *
 * Functions that purely delegate to the repository still exist here so that the
 * controller always goes through the service — this ensures a single call-chain
 * that is easy to intercept and extend (e.g. add audit logging, send emails).
 */

import { NotFoundError } from "../../shared/errors/api-error.class.ts";
import { toTitleCase } from "../../shared/utils/string.util.ts";
import * as eventsRepo from "./events.repository.ts";
import type {
  CreateEventInput,
  RegisterForEventInput,
  UpdateEventInput,
} from "./events.validator.ts";

/**
 * Returns all upcoming events for the public-facing listing page.
 * Ordering and filtering are handled in the repository.
 *
 * @returns Array of upcoming Event records.
 */
export async function listUpcomingEvents() {
  return eventsRepo.listUpcomingEvents();
}

/**
 * Fetches a single event by ID, throwing a 404 if it does not exist.
 * Used internally by `registerForEvent` to validate the target event
 * before creating a registration record.
 *
 * @param id - UUID of the event.
 * @returns  The Event record.
 * @throws   NotFoundError if no event matches the given ID.
 */
export async function getEventById(id: string) {
  const event = await eventsRepo.findEventById(id);
  // Convert a null result into a domain error with a descriptive message
  if (!event) throw new NotFoundError("Event not found");
  return event;
}

/**
 * Registers a visitor for an event.
 *
 * The event existence check runs first: if the event doesn't exist we fail
 * fast with a 404 rather than allowing an orphaned registration to be created
 * with a foreign-key violation at the database level.
 *
 * The registrant's name is Title-Cased for consistent display in admin views.
 *
 * @param eventId - UUID of the event to register for.
 * @param input   - Validated registration form data.
 * @returns       The newly created EventRegistration record.
 * @throws        NotFoundError if the event does not exist.
 */
export async function registerForEvent(eventId: string, input: RegisterForEventInput) {
  // Guard: confirm the event exists before creating a registration
  await getEventById(eventId);
  // Build explicitly to satisfy exactOptionalPropertyTypes (Zod infers `T | undefined`; Prisma wants presence/absence)
  return eventsRepo.createRegistration(eventId, {
    name: toTitleCase(input.name),
    email: input.email,
    ...(input.company !== undefined && { company: input.company }),
    ...(input.phone !== undefined && { phone: input.phone }),
    ...(input.message !== undefined && { message: input.message }),
  });
}

/**
 * Returns a paginated, optionally filtered list of events for the admin panel.
 *
 * @param page   - 1-based page number.
 * @param limit  - Records per page (capped in the controller).
 * @param status - Optional event status filter.
 * @returns      `{ data: Event[], total: number }` with registration counts.
 */
export async function listAdminEvents(page: number, limit: number, status?: string) {
  return eventsRepo.listAdminEvents(page, limit, status);
}

/**
 * Creates a new event, converting the ISO datetime string from the request
 * body into a proper JS Date object that Prisma can store correctly.
 *
 * @param input - Validated event creation payload.
 * @returns     The newly created Event record.
 */
export async function createEvent(input: CreateEventInput) {
  // eventDate arrives as an ISO 8601 string from JSON — convert to Date for Prisma
  return eventsRepo.createEvent({
    title: input.title,
    description: input.description,
    city: input.city,
    tag: input.tag,
    status: input.status,
    eventDate: new Date(input.eventDate),
    ...(input.venue !== undefined && { venue: input.venue }),
    ...(input.capacity !== undefined && { capacity: input.capacity }),
  });
}

/**
 * Partially updates an existing event.
 *
 * Because `UpdateEventInput` is a partial type (all fields optional), we build
 * a mutable intermediate object and only override `eventDate` when it is
 * actually present in the update payload — avoiding an unnecessary Date()
 * conversion when the date isn't being changed.
 *
 * @param id    - UUID of the event to update.
 * @param input - Partial update payload; only provided fields are changed.
 * @returns     The updated Event record.
 */
export async function updateEvent(id: string, input: UpdateEventInput) {
  const data: Record<string, unknown> = { ...input };
  // Only convert eventDate if it was included in this update request
  if (input.eventDate) data["eventDate"] = new Date(input.eventDate);
  return eventsRepo.updateEvent(id, data as Parameters<typeof eventsRepo.updateEvent>[1]);
}

/**
 * Deletes an event by ID.
 *
 * Prisma throws P2025 when the target record doesn't exist. We catch any
 * error from the delete call and re-throw as NotFoundError so the global
 * handler returns an HTTP 404 instead of a 500.
 *
 * @param id - UUID of the event to delete.
 * @throws   NotFoundError if no event with the given ID exists.
 */
export async function deleteEvent(id: string) {
  try {
    await eventsRepo.deleteEvent(id);
  } catch {
    // Prisma P2025 ("Record to delete does not exist") arrives here
    throw new NotFoundError("Event not found");
  }
}

/**
 * Returns a paginated list of registrations for a specific event.
 *
 * @param eventId - UUID of the parent event.
 * @param page    - 1-based page number.
 * @param limit   - Records per page.
 * @param status  - Optional registration status filter.
 * @returns       `{ data: EventRegistration[], total: number }`
 */
export async function getEventRegistrations(
  eventId: string,
  page: number,
  limit: number,
  status?: string,
) {
  return eventsRepo.listEventRegistrations(eventId, page, limit, status);
}

/**
 * Returns a cross-event paginated list of all registrations.
 * Used on the admin "all registrations" overview page.
 *
 * @param page   - 1-based page number.
 * @param limit  - Records per page.
 * @param status - Optional registration status filter.
 * @param search - Optional free-text search (name or email).
 * @returns      `{ data: EventRegistration[], total: number }`
 */
export async function listAllRegistrations(
  page: number,
  limit: number,
  status?: string,
  search?: string,
) {
  return eventsRepo.listAllRegistrations(page, limit, status, search);
}

/**
 * Updates the lifecycle status of a registration (e.g. 'pending' → 'confirmed').
 * Status values are validated by Zod in the controller before this is called.
 *
 * @param id     - UUID of the EventRegistration to update.
 * @param status - New status string.
 * @returns      The updated EventRegistration record.
 */
export async function updateRegistrationStatus(id: string, status: string) {
  return eventsRepo.updateRegistrationStatus(id, status);
}
