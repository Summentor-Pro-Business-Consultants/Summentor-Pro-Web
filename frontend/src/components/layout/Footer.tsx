"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

// Half the CTA card's tallest rendered height — used as the negative
// margin so the card straddles the footer's slant boundary 50/50.
const CTA_OVERLAP = 124;

export default function Footer() {
  const pathname = usePathname();
  const isServices = pathname === "/services";
  // The straddling green CTA band is hidden on About + Platforms (their last
  // section already serves as the closer). Solutions shows the band but with
  // its own "Looking to explore" copy + logo. About + Solutions get the flat
  // (no-slant) footer top.
  const hideCta = ["/about", "/events", "/contact"].includes(pathname);
  const flatFooter = ["/about", "/services", "/events", "/contact"].includes(pathname);

  return (
    <>
      {/* CTA band — rendered OUTSIDE the clipped <footer> so its top half
          sits on the light section above and its bottom half on the dark
          footer below. Negative marginBottom pulls the footer up so the
          slant line crosses through the card's vertical centre. */}
      {!hideCta && (
      <div
        style={{
          position: "relative",
          zIndex: 2,
          paddingTop: 32,
          marginBottom: -CTA_OVERLAP,
        }}
      >
        <Container style={{ maxWidth: 1320 }}>
          <div
            style={{
              background: "var(--sp-green-700)",
              borderRadius: 24,
              padding: "clamp(28px, 5vw, 48px) clamp(32px, 6vw, 72px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 40,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 24px 56px -20px rgba(10,10,10,0.45)",
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
                fontSize: "clamp(28px, 4vw, 56px)",
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
              {isServices ? (
                <>
                  LOOKING TO EXPLORE
                  <br />
                  STRATEGIC GROWTH
                  <br />
                  OPPORTUNITIES?
                </>
              ) : (
                <>
                  LET&apos;S BUILD MEANINGFUL
                  <br />
                  BUSINESS OPPORTUNITIES
                  <br />
                  TOGETHER.
                </>
              )}
            </h2>

            {/* Illustration — hidden on small screens so the heading isn't
                crowded on phones. Solutions uses the brand logo mark; other
                pages use the handshake. Both rendered as white silhouettes. */}
            <div
              className="hidden sm:block"
              style={{
                flexShrink: 0,
                position: "relative",
                zIndex: 1,
                marginRight: "clamp(16px, 3.5vw, 64px)",
              }}
            >
              {isServices ? (
                <svg
                  aria-hidden="true"
                  width={185}
                  height={185}
                  viewBox="0 0 120 120"
                  fill="none"
                  style={{ display: "block" }}
                >
                  {/* Bold up-right "explore / growth" arrow */}
                  <path
                    d="M26 94 L94 26"
                    stroke="#fff"
                    strokeWidth={13}
                    strokeLinecap="round"
                  />
                  <path
                    d="M48 26 L94 26 L94 72"
                    stroke="#fff"
                    strokeWidth={13}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <img
                  src="/icons/handshake.svg"
                  alt=""
                  aria-hidden="true"
                  width={216}
                  height={216}
                  style={{
                    // brightness(0) invert(1) → pure white; the stacked white
                    // drop-shadows thicken the (fill-based) icon so it reads
                    // bolder, since stroke-width can't be changed on an <img>.
                    filter:
                      "brightness(0) invert(1) drop-shadow(1.2px 0 0 #fff) drop-shadow(-1.2px 0 0 #fff) drop-shadow(0 1.2px 0 #fff) drop-shadow(0 -1.2px 0 #fff)",
                    opacity: 0.95,
                  }}
                />
              )}
            </div>
          </div>
        </Container>
      </div>
      )}

      <footer
        style={{
          background: "var(--sp-navy-1000)",
          // Grid lines on top, alternating dark gradient (grad-b: dark-left →
          // light-right) as the bottom layer.
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), var(--sp-dark-grad-b)",
          backgroundSize: "44px 44px, 44px 44px, cover",
          color: "var(--sp-navy-300)",
          position: "relative",
          // Left-downwards "/" slant on top → top-LEFT pushed down. Alternates
          // from the StatsBar's bottom "\" slant above for the rhythm spec.
          // The About page footer is flat (no slant); other pages keep it.
          clipPath: flatFooter
            ? "none"
            : "polygon(0 var(--sp-slant), 100% 0, 100% 100%, 0 100%)",
          // Top padding: no CTA (About) → small pad; CTA on a flat footer
          // (Solutions) → clear the straddle, no slant; CTA on a slanted
          // footer (other pages) → clear the straddle + slant.
          paddingTop: hideCta
            ? flatFooter
              ? `56px`
              : `calc(var(--sp-slant) + 48px)`
            : flatFooter
              ? `${CTA_OVERLAP + 40}px`
              : `calc(var(--sp-slant) + ${CTA_OVERLAP + 28}px)`,
        }}
      >
      {/* Main footer columns */}
      <div style={{ paddingBottom: 28 }}>
        <Container>
          <div
            className="grid gap-10 pb-8"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              borderBottom: "1px solid var(--sp-navy-700)",
            }}
          >
            {/* Brand column */}
            <div style={{ gridColumn: "span 2" }} className="min-w-0">
              <Logo height={92} />
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
                    color: "var(--sp-green-400)",
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
          <div className="flex justify-center gap-6 py-6" style={{ borderBottom: "1px solid var(--sp-navy-700)" }}>
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
            className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5"
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
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--sp-green-400)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--sp-navy-600)")}
              >
                Admin
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
    </>
  );
}
