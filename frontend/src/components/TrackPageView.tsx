"use client";

/**
 * TrackPageView — fires a page-view event on every route change.
 *
 * This is a client component (renders nothing) placed in the root layout so
 * it runs on every public page. It listens to `usePathname()` and calls
 * `trackPageView` whenever the URL changes, including the initial load.
 *
 * Admin routes are filtered out inside `trackPageView` itself.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/tracking";

export default function TrackPageView() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
