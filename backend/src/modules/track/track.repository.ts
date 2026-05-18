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
