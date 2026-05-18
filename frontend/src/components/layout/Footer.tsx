"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";

const footerColumns = [
  {
    title: "Solutions",
    links: [
      { label: "Strategic Consulting", href: "/services#consulting" },
      { label: "Government Facilitation", href: "/services#government" },
      { label: "Industry Platforms", href: "/services#platforms" },
      { label: "Brand & Market Growth", href: "/services#branding" },
      { label: "ConnectNow", href: "/services#connectnow" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Platforms", href: "/events" },
      { label: "Platform Highlights", href: "/blogs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Partner With Us", href: "/contact" },
      { label: "Explore Platforms", href: "/events" },
      { label: "LinkedIn", href: "#" },
      { label: "Twitter / X", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
];

const badges = [
  { label: "DPIIT", sub: "Registered" },
  { label: "MSME", sub: "Ministry Recognised" },
  { label: "NASSCOM", sub: "Partner" },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--sp-navy-1000, #050d1a)",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        color: "var(--sp-navy-300)",
      }}
    >
      {/* CTA band — green rounded card matching PDF design */}
      <div style={{ padding: "48px 0" }}>
        <Container>
          <div
            style={{
              background: "var(--sp-green-700)",
              borderRadius: 20,
              padding: "48px 56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Subtle inner glow */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 20,
              background: "radial-gradient(ellipse at top left, rgba(255,255,255,0.08) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />

            {/* Text */}
            <h2
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: "clamp(22px, 3.2vw, 44px)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.01em",
                color: "#fff",
                margin: 0,
                lineHeight: 1.15,
                position: "relative",
                zIndex: 1,
              }}
            >
              LET&apos;S BUILD MEANINGFUL
              <br />
              BUSINESS OPPORTUNITIES
              <br />
              TOGETHER.
            </h2>

            {/* Handshake illustration */}
            <div style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/handshake-svgrepo-com.svg"
                alt=""
                aria-hidden="true"
                width={180}
                height={180}
                style={{
                  filter: "brightness(0) invert(1)",
                  opacity: 0.9,
                }}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Main footer columns */}
      <div style={{ paddingTop: 64, paddingBottom: 32 }}>
        <Container>
          <div
            className="grid gap-10 pb-12"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              borderBottom: "1px solid var(--sp-navy-700)",
            }}
          >
            {/* Brand column */}
            <div style={{ gridColumn: "span 2" }} className="min-w-0">
              <Logo />
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--sp-navy-300)",
                  marginTop: 16,
                  maxWidth: 300,
                }}
              >
                The growth advisory firm trusted by 200+ businesses across India. Elevating MSMEs
                and enterprises through consulting, platforms, and strategic partnerships.
              </p>
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 12,
                  color: "var(--sp-navy-400)",
                  marginTop: 12,
                  lineHeight: 1.5,
                }}
              >
                5th Block, SPD Plaza, #52, 1st Floor,
                <br />
                Koramangala, Bangalore 560034
                <br />
                info@summentorpro.com · 080-41574773
              </p>
            </div>

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.title}>
                <div
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--sp-green-500)",
                    marginBottom: 16,
                  }}
                >
                  {col.title}
                </div>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 14,
                        color: "var(--sp-navy-200)",
                        textDecoration: "none",
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "var(--sp-green-400)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "var(--sp-navy-200)")
                      }
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recognition badges */}
          <div className="flex justify-center gap-6 py-8" style={{ borderBottom: "1px solid var(--sp-navy-700)" }}>
            {badges.map((badge) => (
              <div
                key={badge.label}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: "1.5px solid var(--sp-navy-600)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: "var(--sp-green-400)",
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                  }}
                >
                  {badge.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 7.5,
                    color: "var(--sp-navy-400)",
                    textTransform: "uppercase",
                    lineHeight: 1.3,
                    marginTop: 3,
                  }}
                >
                  {badge.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Copyright bar */}
          <div
            className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6"
            style={{ fontFamily: "var(--sp-font-sans)", fontSize: 12, color: "var(--sp-navy-400)" }}
          >
            <div>
              © {new Date().getFullYear()} Summentor Pro Business Consultants. All rights reserved.
            </div>
            <div className="flex gap-6 items-center">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <a key={item} href="#" style={{ color: "var(--sp-navy-400)", textDecoration: "none" }}>
                  {item}
                </a>
              ))}
              <Link
                href="/admin/dashboard"
                style={{
                  color: "var(--sp-navy-600)",
                  textDecoration: "none",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--sp-green-500)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--sp-navy-600)")}
              >
                Admin
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
