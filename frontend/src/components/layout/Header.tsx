"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Container from "@/components/ui/Container";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Solutions", href: "/services" },
  { label: "Platforms", href: "/events" },
  { label: "Platform Highlights", href: "/blogs" },
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
        background: "var(--sp-navy-900)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: scrolled ? "0 4px 24px rgba(10,26,47,0.3)" : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <Container>
        <div className="flex items-center" style={{ height: 64 }}>
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex flex-1 items-center justify-end gap-0 ml-auto">
            {navLinks.map((link, idx) => (
              <Fragment key={link.href}>
                {idx > 0 && (
                  <span
                    style={{
                      color: "var(--sp-navy-500)",
                      fontSize: 14,
                      margin: "0 4px",
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
                    fontSize: 13.5,
                    color: isActive(link.href) ? "var(--sp-green-400)" : "var(--sp-navy-200)",
                    textDecoration: "none",
                    padding: "22px 6px",
                    borderBottom: isActive(link.href)
                      ? "2px solid var(--sp-green-500)"
                      : "2px solid transparent",
                    marginBottom: -2,
                    transition: "color 0.15s ease, border-color 0.15s ease",
                    fontWeight: isActive(link.href) ? 600 : 400,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.href)) (e.target as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href))
                      (e.target as HTMLElement).style.color = "var(--sp-navy-200)";
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
              color: "var(--sp-navy-200)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

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
              background: "var(--sp-navy-800)",
              borderTop: "1px solid var(--sp-navy-700)",
              overflow: "hidden",
            }}
          >
            <Container>
              <nav className="flex flex-col py-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 15,
                      color: isActive(link.href) ? "var(--sp-green-400)" : "var(--sp-navy-200)",
                      textDecoration: "none",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--sp-navy-700)",
                      fontWeight: isActive(link.href) ? 600 : 400,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
