"use client";

/**
 * TrackScrollDepth — fires a `scroll_depth` event at 25/50/75/100 % milestones.
 *
 * Renders nothing; sits in the root layout next to TrackPageView so it runs on
 * every public page. Each milestone fires at most once per page view, and the
 * set of already-fired milestones resets whenever the route changes.
 *
 * Design notes:
 *  - Milestones (not raw scroll position) keep the event volume bounded: at
 *    most four rows per session per page, however much the visitor scrolls.
 *  - The scroll listener is passive and the work per event is a couple of
 *    reads plus an integer compare, so it stays off the critical path.
 *  - Pages shorter than the viewport can never scroll, so they report 100 %
 *    immediately — otherwise short pages would look like total bounces.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/tracking";

const MILESTONES = [25, 50, 75, 100] as const;

export default function TrackScrollDepth() {
  const pathname = usePathname();
  // Milestones already reported for the current page.
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // New page — start milestone tracking over.
    firedRef.current = new Set();

    const report = (depth: number) => {
      if (firedRef.current.has(depth)) return;
      firedRef.current.add(depth);
      void trackEvent("scroll_depth", pathname, { value: depth });
    };

    const measure = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;

      // Nothing to scroll: the visitor has by definition seen the whole page.
      if (scrollable <= 0) {
        report(100);
        return;
      }

      const pct = ((window.scrollY || doc.scrollTop) / scrollable) * 100;
      for (const m of MILESTONES) {
        if (pct >= m) report(m);
      }
    };

    // Measure once on mount so short pages and restored scroll positions count.
    measure();

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  return null;
}
