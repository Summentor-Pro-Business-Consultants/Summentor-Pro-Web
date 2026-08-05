import { Prisma } from "../../generated/prisma/index.js";
import { prisma } from "../../infrastructure/db/prisma.client.ts";

interface PageViewData {
  path: string;
  referrer: string | null;
  source: string;
  city: string | null;
  country: string | null;
  sessionId: string | null;
}

export async function createPageView(data: PageViewData) {
  return prisma.pageView.create({ data });
}

interface TrackedEventData {
  name: string;
  category: string;
  path: string;
  label: string | null;
  value: number | null;
  /** Omitted entirely when the client sent no extra properties. */
  properties?: Prisma.InputJsonValue;
  source: string;
  city: string | null;
  country: string | null;
  sessionId: string | null;
}

export async function createTrackedEvent(data: TrackedEventData) {
  return prisma.trackedEvent.create({ data });
}
