/**
 * AdminShell — /components/admin/AdminShell.tsx
 *
 * WHY THIS FILE EXISTS:
 * The admin layout needs to behave differently on the login page (full-screen,
 * no sidebar) versus every other admin page (sidebar + main content area).
 * Because usePathname() is a client-side hook we cannot call it inside a Server
 * Component, so AdminShell is a dedicated "use client" wrapper that makes this
 * routing-aware decision without forcing the whole layout to be a client component.
 *
 * WHAT IT DOES:
 * - Reads the current URL pathname with usePathname().
 * - On /admin/login: renders children directly (full-screen login form, no chrome).
 * - On every other /admin/* route: renders the two-column shell:
 *     [Sidebar 240px] | [Scrollable main content area, flex 1]
 *
 * HOW IT FITS:
 *   AdminLayout (server component)
 *     └─ AdminShell (client component — route-aware)
 *         ├─ Sidebar  (rendered for all non-login routes)
 *         └─ children (the current page)
 */

"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

/**
 * AdminShell
 *
 * Conditionally wraps page content in the two-column admin chrome.
 * Must be a client component because usePathname() is a client-only hook.
 *
 * @param children - The current page rendered by Next.js routing.
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  // usePathname() returns the current URL path, e.g. "/admin/dashboard".
  // We use it to suppress the sidebar on the login page.
  const pathname = usePathname();

  // Login page: render children without any admin chrome so the login card
  // can be centred on a plain background.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // All other admin pages: render the classic sidebar + content layout.
  // The outer div uses flexbox so the Sidebar and main area sit side by side.
  return (
    // height:100vh + overflow:hidden locks the shell to the viewport so only
    // the main content column scrolls — the sidebar stays fixed in place.
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F1F5F9" }}>
      {/* Fixed-width 240px dark sidebar with navigation */}
      <Sidebar />

      {/* Main content column — grows to fill remaining horizontal space.
          minWidth:0 prevents flex children from overflowing on narrow viewports. */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Scrollable content area with consistent page padding */}
        <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}
