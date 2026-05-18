/**
 * Admin Layout — /app/admin/layout.tsx
 *
 * WHY THIS FILE EXISTS:
 * Next.js App Router uses nested layouts. Any route under /admin/* automatically
 * renders inside this layout, so we have one place to set up auth and the shell UI.
 *
 * WHAT IT DOES:
 * 1. Sets the browser <title> for every admin page via Next.js metadata export.
 * 2. Wraps all admin children in <AuthProvider> so every child component can call
 *    useAuth() to read the current admin session or trigger logout.
 * 3. Delegates the visual shell (sidebar + content area) to <AdminShell>, which
 *    decides whether to show the sidebar based on the current route.
 *
 * HOW IT FITS:
 *   Browser → /admin/** → This layout wraps everything
 *     └─ AuthProvider  (React context: admin session, login(), logout())
 *         └─ AdminShell (conditionally renders Sidebar + main content area)
 *             └─ {children}  (the actual page component)
 */

import { AuthProvider } from "@/lib/auth-context";
import AdminShell from "@/components/admin/AdminShell";

// Next.js reads this export and injects it as the <title> tag for all /admin pages.
export const metadata = { title: "Admin — Summentor Pro" };

/**
 * AdminLayout
 *
 * Root layout for every route under /admin/*.
 * Receives `children` from Next.js — the matched page component for the current URL.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // AuthProvider makes login state available to the entire admin subtree via React context.
    <AuthProvider>
      {/* AdminShell decides whether to render the sidebar (hidden on /admin/login). */}
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
