/**
 * AdminLoginPage — /app/admin/login/page.tsx
 *
 * WHY THIS FILE EXISTS:
 * This is the authentication gate for the entire admin panel. Before an admin
 * can access any /admin/* route, they must authenticate through this page.
 * AdminShell hides the sidebar on this route so the login card gets a full-screen
 * centred layout without any navigation chrome.
 *
 * WHAT IT RENDERS:
 * A full-screen slate-grey background with a centred white card containing:
 *   - Brand logo (blue square + SVG icon) and product name
 *   - Email and password inputs
 *   - An error banner (only shown on failed login)
 *   - A "Sign In" submit button that shows a loading state
 *
 * AUTH FLOW:
 * On submit, calls useAuth().login(email, password) which posts credentials
 * to the backend API and stores the returned session token. On success,
 * window.location.href is used (rather than router.push) to force a full page
 * reload — this ensures AuthProvider re-initialises from the newly stored token
 * before the dashboard tries to render any protected content.
 *
 * HOW IT FITS:
 * Rendered at /admin/login. The AuthProvider (from AdminLayout) is still active
 * here, so useAuth() works. AdminShell detects "/admin/login" and skips the
 * sidebar wrapper, giving this page full-screen control.
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/admin-api";

/**
 * AdminLoginPage
 *
 * Full-screen login form for the Summentor Pro admin panel.
 * Delegates credential verification to the AuthContext login() method.
 */
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  /**
   * handleSubmit — processes the login form submission.
   * Prevents the default HTML form submission (which would cause a page reload),
   * then calls the auth context's login function. On success it navigates to the
   * dashboard; on any error it displays a generic "Invalid credentials" message
   * to avoid leaking information about which field is wrong.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      // Full page reload to /admin/dashboard so AuthProvider re-reads the new session token
      window.location.href = "/admin/dashboard";
    } catch (err) {
      // Distinguish the failure types so a server/connection problem isn't
      // misreported as bad credentials. The 401 case stays deliberately vague
      // (doesn't reveal which field is wrong).
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 400) {
          // 401 = wrong credentials; 400 = failed input validation (e.g. bad
          // email format). Both are the user's input — keep the message vague.
          setError("Invalid email or password");
        } else if (err.status === 429) {
          setError("Too many attempts. Please wait a moment and try again.");
        } else {
          setError("Server error — please try again in a moment.");
        }
      } else {
        // fetch() rejected before getting a response → server unreachable.
        setError("Can't reach the server. Check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * inputStyle — shared styles for both email and password inputs.
   * Defined inline here (rather than as a module-level const) because this is
   * the only component that uses these styles.
   */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #E2E8F0",
    borderRadius: 8,
    fontSize: 14,
    color: "#1E293B",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    /* ── Full-screen centred background ───────────────────────────────────── */
    <div
      style={{
        minHeight: "100vh",
        background: "#F1F5F9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* ── Login card ────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 400,
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Brand header ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          {/* Blue brand icon square — SVG layers icon */}
          <div
            style={{
              width: 44,
              height: 44,
              background: "#3C50E0",
              borderRadius: 10,
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Custom SVG "layers" icon representing the Summentor Pro brand mark */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", margin: 0 }}>
            Summentor Pro
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>Admin dashboard sign in</p>
        </div>

        {/* ── Login form ────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Email field */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
                display: "block",
                marginBottom: 5,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="admin@summentorpro.com"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
                display: "block",
                marginBottom: 5,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
            />
          </div>

          {/* ── Error banner (only shown when login fails) ─────────────── */}
          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 6,
                padding: "8px 12px",
                color: "#DC2626",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* ── Submit button ─────────────────────────────────────────────
              Disabled during the async login call to prevent double-submission.
              Cursor changes to "wait" as a visual loading indicator.
          ─────────────────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "11px",
              borderRadius: 8,
              border: "none",
              background: "#3C50E0",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              marginTop: 4,
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
