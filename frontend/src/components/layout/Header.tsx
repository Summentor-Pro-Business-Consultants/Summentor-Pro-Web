"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Solutions", href: "/services" },
  { label: "Platforms", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      style={{
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--sp-gray-200)",
        boxShadow: scrolled ? "0 2px 16px rgba(10,26,47,0.08)" : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* Full-width row — logo flush to left edge with its own padding,
          nav pushed to the right edge with matching padding. Bypasses the
          centered Container so the logo isn't trapped in the 1200px frame. */}
      <div
        className="flex items-center"
        style={{
          height: 84,
          // Logo PNG carries generous built-in whitespace top/bottom; clip it
          // so the bar can be shorter while the visible mark stays the same
          // rendered size (height={100}).
          overflow: "hidden",
          paddingLeft: "clamp(20px, 3vw, 48px)",
          paddingRight: "clamp(20px, 3vw, 48px)",
        }}
      >
        <Logo height={100} />

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-1 items-center justify-end gap-0 ml-auto">
          {navLinks.map((link, idx) => (
            <Fragment key={link.href}>
              {idx > 0 && (
                <span
                  style={{
                    color: "var(--sp-gray-300)",
                    fontSize: 19.5,
                    margin: "0 9px",
                    userSelect: "none",
                  }}
                >
                  /
                </span>
              )}
              <Link
                href={link.href}
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 19.5,
                  color: isActive(link.href) ? "var(--sp-green-700)" : "var(--sp-navy-900)",
                  textDecoration: "none",
                  padding: "28px 13px",
                  borderBottom: isActive(link.href)
                    ? "2px solid var(--sp-green-600)"
                    : "2px solid transparent",
                  marginBottom: -2,
                  transition: "color 0.15s ease, border-color 0.15s ease",
                  fontWeight: isActive(link.href) ? 600 : 500,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href))
                    (e.target as HTMLElement).style.color = "var(--sp-green-700)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href))
                    (e.target as HTMLElement).style.color = "var(--sp-navy-900)";
                }}
              >
                {link.label}
              </Link>
            </Fragment>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{
            color: "var(--sp-navy-900)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "#fff",
              borderTop: "1px solid var(--sp-gray-200)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                paddingLeft: "clamp(20px, 3vw, 40px)",
                paddingRight: "clamp(20px, 3vw, 40px)",
              }}
            >
              <nav className="flex flex-col py-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 19,
                      color: isActive(link.href) ? "var(--sp-green-700)" : "var(--sp-navy-900)",
                      textDecoration: "none",
                      padding: "14px 0",
                      borderBottom: "1px solid var(--sp-gray-200)",
                      fontWeight: isActive(link.href) ? 600 : 500,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
