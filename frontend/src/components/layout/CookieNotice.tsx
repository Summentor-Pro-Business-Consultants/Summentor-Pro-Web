"use client";

/**
 * CookieNotice — dismissible cookie-consent banner shown at the bottom of the
 * viewport on public pages.
 *
 * Consent is implicit ("by continuing to browse … you consent"), so a single
 * "Accept" acknowledgement is enough. The choice is remembered in
 * localStorage (`sp-cookie-consent`) so the banner does not reappear on later
 * visits. It renders nothing on the server / first client paint to avoid a
 * hydration mismatch, then reveals only if no prior acknowledgement is found.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "sp-cookie-consent";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage blocked (private mode etc.) — still show the notice; it
      // just won't be remembered between visits.
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore — nothing we can do if storage is unavailable */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie notice"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            left: "clamp(12px, 3vw, 28px)",
            right: "clamp(12px, 3vw, 28px)",
            bottom: "clamp(12px, 3vw, 28px)",
            zIndex: 1000,
            margin: "0 auto",
            maxWidth: 1140,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 14,
            boxShadow: "0 20px 52px -18px rgba(10,10,10,0.4)",
            padding: "clamp(16px, 2.2vw, 22px) clamp(18px, 3vw, 30px)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(14px, 3vw, 32px)",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              flex: "1 1 320px",
              margin: 0,
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(13px, 1.5vw, 15px)",
              lineHeight: 1.4,
              color: "#3a3a3a",
            }}
          >
            We use cookies and similar technologies to improve website functionality, analyze
            traffic and enhance user experience. By continuing to browse this website, you consent
            to our{" "}
            <Link
              href="/cookies-policy"
              style={{
                color: "var(--sp-green-600)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              use of cookies
            </Link>
            .
          </p>

          <button
            type="button"
            onClick={accept}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#047a54")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sp-green-600)")}
            style={{
              flexShrink: 0,
              fontFamily: "var(--sp-font-sans)",
              fontSize: 15,
              fontWeight: 500,
              color: "#fff",
              background: "var(--sp-green-600)",
              border: "none",
              borderRadius: 999,
              padding: "11px 36px",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
          >
            Accept
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
