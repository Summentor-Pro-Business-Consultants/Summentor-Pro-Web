/**
 * Sidebar — /components/admin/Sidebar.tsx
 *
 * WHY THIS FILE EXISTS:
 * Provides the persistent left-hand navigation column that appears on every
 * authenticated admin page (except /admin/login, which AdminShell hides it for).
 * Centralising navigation here means adding a new section only requires updating
 * the `navItems` array and nothing else.
 *
 * WHAT IT RENDERS:
 * A 240px dark sidebar (#1C2434) divided into three vertical sections:
 *   1. Logo area  — brand name + "ADMIN PANEL" label
 *   2. Nav area   — list of navigation links with active-state highlighting
 *   3. User area  — logged-in admin name/email, "View Website" link, logout button
 *
 * ACTIVE STATE:
 * A nav link is considered "active" when the current pathname starts with the
 * link's href. This means /admin/events/123 correctly highlights the "Events"
 * link, because pathname.startsWith("/admin/events") is true.
 *
 * HOW IT FITS:
 *   AdminShell renders <Sidebar /> on every non-login admin route.
 *   Sidebar reads from useAuth() (AuthContext) to show the admin's name and
 *   to call logout() when the user clicks "Sign out".
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Calendar,
  Users,
  LogOut,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

/**
 * navItems — the ordered list of main navigation destinations.
 * Each entry maps a human-readable label to a route and a Lucide icon component.
 * Add or reorder entries here to change what appears in the sidebar nav.
 */
const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Contacts", href: "/admin/contacts", icon: Mail },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Registrations", href: "/admin/registrations", icon: Users },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
];

/**
 * Sidebar
 *
 * The full-height dark navigation sidebar rendered alongside all admin pages.
 * Uses usePathname() to apply active styles and useAuth() for user info + logout.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const router = useRouter();

  /**
   * handleLogout
   * Calls the auth context's logout() (which clears the session token), then
   * redirects to /admin/login. Using router.push keeps this a client-side
   * navigation rather than a full page reload.
   */
  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <aside
      style={{
        width: 240,
        height: "100%",
        background: "#1C2434", // TailAdmin-style dark navy
        display: "flex",
        flexDirection: "column",
        flexShrink: 0, // Prevent the sidebar from collapsing when content is wide
        overflowY: "auto", // allow sidebar itself to scroll if nav grows
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16.6, letterSpacing: "-0.01em" }}>
          Summentor Pro
        </div>
        {/* Subtle label below the product name to signal this is the admin area */}
        <div style={{ color: "#64748B", fontSize: 10.1, marginTop: 2, letterSpacing: "0.05em" }}>
          ADMIN PANEL
        </div>
      </div>

      {/* ── Navigation links ──────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          // Active when the current URL starts with this link's href.
          // startsWith is used so child routes (e.g. /admin/events/123) also
          // highlight the parent nav item.
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 6,
                marginBottom: 2,
                // Active item: white text on brand-blue background
                // Inactive item: muted text on transparent background
                color: active ? "#fff" : "#A0AEC0",
                background: active ? "#3C50E0" : "transparent",
                textDecoration: "none",
                fontSize: 12.9,
                fontWeight: active ? 600 : 400,
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {/* Slightly heavier stroke weight when active to match the bolder text */}
              <Icon size={17} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── User info + actions ───────────────────────────────────────────────── */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Display the logged-in admin's name and email from the auth context.
            Falls back to "Admin" if name is not populated. */}
        <div style={{ padding: "8px 12px", marginBottom: 4 }}>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>
            {admin?.name ?? "Admin"}
          </div>
          <div style={{ color: "#64748B", fontSize: 10.1, marginTop: 1 }}>{admin?.email}</div>
        </div>

        {/* View Website — opens the public-facing site in a new tab */}
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 6,
            color: "#A0AEC0",
            textDecoration: "none",
            fontSize: 12.9,
            marginBottom: 2,
          }}
        >
          <ExternalLink size={16} strokeWidth={1.5} />
          View Website
        </Link>

        {/* Sign out — calls handleLogout which invalidates the session */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 6,
            background: "transparent",
            border: "none",
            color: "#EF4444", // Red to signal a destructive / exit action
            fontSize: 12.9,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
