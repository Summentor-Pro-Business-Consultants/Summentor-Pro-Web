/**
 * events.repository.ts — Events Module: Data Access Layer
 *
 * This file is the only place in the events module that interacts with the
 * database. All functions are thin, focused Prisma wrappers that carry out a
 * single query each. Business rules (existence checks, date conversion, name
 * normalisation) belong in events.service.ts — not here.
 *
 * Two Prisma models are queried in this file:
 *   - Event             — the event record itself
 *   - EventRegistration — a visitor's registration for a specific event
 *
 * Pagination is handled by the shared `getPagination` utility which converts a
 * 1-based page + limit into the `{ take, skip }` object Prisma expects.
 */

import { prisma } from "../../infrastructure/db/prisma.client.ts";
import { getPagination } from "../../shared/utils/pagination.util.ts";

/**
 * Fetches all events with a status of 'upcoming', ordered chronologically.
 * Used by the public-facing events listing page.
 *
 * @returns Array of upcoming Event records (oldest first).
 */
export async function listUpcomingEvents() {
  return prisma.event.findMany({
    where: { status: "upcoming" },
    orderBy: { eventDate: "asc" },
  });
}

/**
 * Looks up a single event by its primary key.
 * Returns `null` if no event with the given ID exists — the service layer
 * decides whether to throw a NotFoundError.
 *
 * @param id - UUID of the Event record.
 * @returns  The Event record or null.
 */
export async function findEventById(id: string) {
  return prisma.event.findUnique({ where: { id } });
}

/**
 * Creates a new EventRegistration linking a visitor to an existing event.
 * The `eventId` is stored as a foreign key; the spread operator passes through
 * all optional fields (company, phone, message) without explicitly listing them.
 *
 * @param eventId - UUID of the event being registered for.
 * @param data    - Visitor details (name, email, and optional fields).
 * @returns       The newly created EventRegistration record.
 */
export async function createRegistration(
  eventId: string,
  data: { name: string; email: string; company?: string; phone?: string; message?: string },
) {
  return prisma.eventRegistration.create({
    data: { ...data, eventId },
  });
}

/**
 * Returns a paginated list of all events for the admin dashboard.
 * Unlike the public listing, this includes all statuses, is ordered newest
 * first, and includes a count of registrations per event for quick overview.
 *
 * @param page   - 1-based page number.
 * @param limit  - Records per page.
 * @param status - Optional filter by event lifecycle status.
 * @returns      `{ data: Event[], total: number }` where each Event has
 *               a `_count.registrations` field.
 */
export async function listAdminEvents(page: number, limit: number, status?: string) {
  const { take, skip } = getPagination(page, limit);
  // Only add the status filter if the caller provided one
  const where = status ? { status } : {};
  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      take,
      skip,
      orderBy: { eventDate: "desc" },
      // Include registration count so the admin list can show "X registered" without a second query
      include: { _count: { select: { registrations: true } } },
    }),
    prisma.event.count({ where }),
  ]);
  return { data, total };
}

/**
 * Inserts a new Event record. The `eventDate` must already be a JS Date object
 * (conversion from ISO string happens in the service layer).
 *
 * @param data - All event fields with eventDate as a Date.
 * @returns    The newly created Event record.
 */
export async function createEvent(data: {
  title: string;
  description: string;
  city: string;
  venue?: string;
  eventDate: Date;
  tag: string;
  capacity?: number;
  status: string;
}) {
  return prisma.event.create({ data });
}

/**
 * Applies a partial update to an existing Event record.
 * Only the fields present in `data` are changed — Prisma ignores undefined keys.
 *
 * @param id   - UUID of the event to update.
 * @param data - Partial set of event fields to update.
 * @returns    The updated Event record.
 */
export async function updateEvent(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    city: string;
    venue: string | null;
    eventDate: Date;
    tag: string;
    capacity: number | null;
    status: string;
  }>,
) {
  return prisma.event.update({ where: { id }, data });
}

/**
 * Hard-deletes an Event by ID. Cascading deletes (if configured in the Prisma
 * schema) will also remove associated EventRegistration records.
 * If the event does not exist, Prisma throws P2025 — caught in the service.
 *
 * @param id - UUID of the event to delete.
 * @returns  The deleted Event record.
 */
export async function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } });
}

/**
 * Returns a paginated list of registrations for a specific event.
 * Useful for the admin "view registrations for event X" detail page.
 *
 * @param eventId - UUID of the parent event.
 * @param page    - 1-based page number.
 * @param limit   - Records per page.
 * @param status  - Optional filter by registration status.
 * @returns       `{ data: EventRegistration[], total: number }`
 */
export async function listEventRegistrations(
  eventId: string,
  page: number,
  limit: number,
  status?: string,
) {
  const { take, skip } = getPagination(page, limit);
  // Always scope to the specific event; optionally also filter by status
  const where: Record<string, unknown> = { eventId };
  if (status) where["status"] = status;
  const [data, total] = await Promise.all([
    prisma.eventRegistration.findMany({ where, take, skip, orderBy: { createdAt: "desc" } }),
    prisma.eventRegistration.count({ where }),
  ]);
  return { data, total };
}

/**
 * Returns a cross-event, paginated list of all registrations for the admin
 * dashboard's registrations overview. Each registration includes the parent
 * event's title and city so admins can see context without a join query.
 *
 * @param page   - 1-based page number.
 * @param limit  - Records per page.
 * @param status - Optional registration status filter.
 * @param search - Optional free-text search matched against registrant name/email.
 * @returns      `{ data: EventRegistration[], total: number }` with event relation included.
 */
export async function listAllRegistrations(
  page: number,
  limit: number,
  status?: string,
  search?: string,
) {
  const { take, skip } = getPagination(page, limit);
  const where: Record<string, unknown> = {};
  if (status) where["status"] = status;
  if (search) {
    // Search by registrant name or email across all events
    where["OR"] = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  const [data, total] = await Promise.all([
    prisma.eventRegistration.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
      // Include just enough event context to render a useful admin row
      include: { event: { select: { title: true, city: true } } },
    }),
    prisma.eventRegistration.count({ where }),
  ]);
  return { data, total };
}

/**
 * Updates the lifecycle status of a single EventRegistration.
 *
 * @param id     - UUID of the EventRegistration to update.
 * @param status - New status ('pending' | 'confirmed' | 'attended' | 'cancelled').
 * @returns      The updated EventRegistration record.
 */
export async function updateRegistrationStatus(id: string, status: string) {
  return prisma.eventRegistration.update({ where: { id }, data: { status } });
}
