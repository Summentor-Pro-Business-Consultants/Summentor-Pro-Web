"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";

// ---------------------------------------------------------------------------
// Footer content (modelled on the shared design)
// ---------------------------------------------------------------------------

const servicesLinks = [
  { label: "Customer Experience", href: "#" },
  { label: "Training Programs", href: "#" },
  { label: "Business Strategy", href: "#" },
  { label: "Training Program", href: "#" },
  { label: "ESG Consulting", href: "#" },
  { label: "Development Hub", href: "#" },
];

const resourcesLinks: { label: string; href: string; badge?: string }[] = [
  { label: "Contact us", href: "/contact" },
  { label: "Team Member", href: "#" },
  { label: "Recognitions", href: "#" },
  { label: "Careers", href: "#", badge: "NEW" },
  { label: "News", href: "/blogs" },
  { label: "Feedback", href: "/contact" },
];

// Brand-glyph paths (simple-icons, 24×24) so the icons don't depend on a
// brand-icon set being present in lucide.
const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/summentorpro/",
    path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v.798h3.466l-.595 3.667h-2.871v7.98H9.101z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/summentorpro/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    label: "X",
    href: "#",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/summentor-pro-business-consultants",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  },
];

// Half the CTA card's tallest rendered height — used as the negative
// margin so the card straddles the footer's slant boundary 50/50.
const CTA_OVERLAP = 124;

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--sp-font-sans)",
        fontSize: 14.7,
        fontWeight: 600,
        color: "#fff",
        marginBottom: 20,
      }}
    >
      {children}
    </div>
  );
}

function FooterLink({ href, label, badge }: { href: string; label: string; badge?: string }) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--sp-font-sans)",
        fontSize: 12.9,
        color: "var(--sp-navy-300)",
        textDecoration: "none",
        transition: "color 0.15s ease",
        width: "fit-content",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#17d99d")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sp-navy-300)")}
    >
      {label}
      {badge && (
        <span
          style={{
            fontFamily: "var(--sp-font-sans)",
            fontSize: 7.8,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#fff",
            background: "#05a171",
            borderRadius: 4,
            padding: "1px 5px",
            lineHeight: 1.3,
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function SocialIcon({ label, href, path }: { label: string; href: string; path: string }) {
  return (
    <a
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        border: "1px solid var(--sp-navy-600)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--sp-navy-200)",
        transition: "color 0.15s ease, border-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#17d99d";
        e.currentTarget.style.borderColor = "#05a171";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--sp-navy-200)";
        e.currentTarget.style.borderColor = "var(--sp-navy-600)";
      }}
    >
      <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

// White Summentor Pro lockup (the PNG is colour artwork — the filter forces it
// to pure white so it reads on the dark footer).
function WhiteLogo({ height }: { height: number }) {
  return (
    <Link href="/" aria-label="Summentor Pro home" style={{ display: "inline-block" }}>
      {}
      <img
        src="/brand/summentor-pro-logo.png"
        alt="Summentor Pro"
        style={{
          height,
          width: "auto",
          display: "block",
          filter: "brightness(0) invert(1)",
        }}
      />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const isServices = pathname === "/services";
  // The straddling green CTA band is hidden on About + Platforms (their last
  // section already serves as the closer). Solutions shows the band but with
  // its own "Looking to explore" copy + logo. About + Solutions get the flat
  // (no-slant) footer top.
  // Legal / policy pages get no CTA band and a flat (un-slanted) footer top so
  // the dark footer meets the white policy body on a clean horizontal line.
  const isLegal = [
    "/privacy-policy",
    "/terms-of-service",
    "/disclaimer",
    "/refund-policy",
    "/cookies-policy",
  ].includes(pathname);
  const hideCta = ["/about", "/events", "/contact"].includes(pathname) || isLegal;
  const flatFooter = ["/about", "/services", "/events", "/contact"].includes(pathname) || isLegal;

  // The newsletter "Send Message" currently routes to the contact page — there
  // is no dedicated newsletter endpoint yet.
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/contact");
  };

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
          {/* White backdrop over the light area only (above the footer overlap)
            so the body grid doesn't show around the straddling card. The
            bottom CTA_OVERLAP stays transparent so the card's lower corners
            sit on the dark footer. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: CTA_OVERLAP,
              background: "#fff",
              zIndex: 0,
            }}
          />
          <Container style={{ maxWidth: 1320, position: "relative", zIndex: 1 }}>
            <div
              style={{
                background: "#32814f",
                borderRadius: 24,
                padding: "clamp(20px, 4vw, 36px) clamp(28px, 5vw, 56px)",
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 20,
                  background:
                    "radial-gradient(ellipse at top left, rgba(255,255,255,0.08) 0%, transparent 60%)",
                  pointerEvents: "none",
                }}
              />

              {/* Text */}
              <h2
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(26px, 3.68vw, 52px)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.01em",
                  color: "#fff",
                  margin: 0,
                  lineHeight: 1.1,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {isServices ? (
                  <>
                    LOOKING TO EXPLORE
                    <br />
                    {/* Heavier than the first line — Goia tops out at bold, so a
                      text stroke is used to push these two lines bolder. */}
                    <span style={{ WebkitTextStroke: "1px currentColor" }}>
                      STRATEGIC GROWTH
                      <br />
                      OPPORTUNITIES?
                    </span>
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
                  zIndex: 1,
                  ...(isServices
                    ? {
                        // Absolutely anchored past the card's bottom edge so the
                        // arrow's base is slightly cut off by it (the card's
                        // overflow:hidden does the clipping). Out of the flex
                        // flow, so it does NOT stretch the card's height.
                        position: "absolute" as const,
                        right: "clamp(16px, 3.5vw, 64px)",
                        bottom: -16,
                        top: "clamp(20px, 3.6vw, 40px)",
                      }
                    : {
                        position: "relative" as const,
                        marginRight: "clamp(16px, 3.5vw, 64px)",
                      }),
                }}
              >
                {isServices ? (
                  <img
                    src="/icons/increase.svg"
                    alt=""
                    aria-hidden="true"
                    style={{
                      display: "block",
                      height: "100%",
                      width: "auto",
                      // black glyph → pure white on the green band
                      filter: "brightness(0) invert(1)",
                      // Slight anticlockwise tilt (matches the design); overflow
                      // past the card edge is clipped by the card.
                      transform: "rotate(-6deg)",
                      transformOrigin: "center",
                    }}
                  />
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
          background: "#0b1d1f",
          // Faint teal glow (top) + subtle grid lines over the solid base.
          backgroundImage:
            "radial-gradient(110% 70% at 50% 0%, rgba(5,161,113,0.10), transparent 55%), linear-gradient(transparent, rgba(255,255,255,0.03) 1.5px, transparent 3px), linear-gradient(90deg, transparent, rgba(255,255,255,0.03) 1.5px, transparent 3px)",
          backgroundSize: "cover, 52px 52px, 52px 52px",
          color: "var(--sp-navy-300)",
          position: "relative",
          clipPath: flatFooter ? "none" : "polygon(0 var(--sp-slant), 100% 0, 100% 100%, 0 100%)",
          paddingTop: hideCta
            ? flatFooter
              ? `56px`
              : `calc(var(--sp-slant) + 48px)`
            : flatFooter
              ? `${CTA_OVERLAP + 40}px`
              : `calc(var(--sp-slant) + ${CTA_OVERLAP + 28}px)`,
          paddingBottom: 28,
        }}
      >
        <Container style={{ maxWidth: 1320 }}>
          {/* Newsletter bar */}
          <form
            onSubmit={handleSubscribe}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid var(--sp-navy-700)",
              borderRadius: 18,
              padding: "clamp(14px, 2vw, 18px) clamp(16px, 2.5vw, 26px)",
              display: "flex",
              alignItems: "center",
              gap: "clamp(14px, 3vw, 28px)",
              flexWrap: "wrap",
            }}
          >
            <WhiteLogo height={100} />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              aria-label="Email address"
              className="sp-news-input"
              style={{
                flex: "1 1 200px",
                minWidth: 0,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontFamily: "var(--sp-font-sans)",
                fontSize: 13.8,
              }}
            />

            <button
              type="submit"
              style={{
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "#1d8687",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "10px 12px 10px 24px",
                fontFamily: "var(--sp-font-sans)",
                fontSize: 13.8,
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#176b6c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1d8687")}
            >
              Send Message
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#0e2d2e",
                }}
              >
                <svg viewBox="0 0 24 24" width={15} height={15} fill="none" aria-hidden="true">
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </form>

          {/* Columns */}
          <div
            className="grid gap-10"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              paddingTop: "clamp(40px, 5vw, 60px)",
              paddingBottom: "clamp(32px, 4vw, 48px)",
            }}
          >
            {/* Brand column */}
            <div style={{ gridColumn: "span 2" }} className="min-w-0">
              <WhiteLogo height={88} />
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 12.9,
                  lineHeight: 1.45,
                  color: "var(--sp-navy-300)",
                  marginTop: 20,
                  maxWidth: 280,
                }}
              >
                Developing personalize our customer journeys to increase satisfaction and loyalty of
                our expansion.
              </p>
              <img
                src="/icons/awards_final.svg"
                alt="18 Clutch Awards · 5 Awwwards"
                style={{
                  display: "block",
                  width: "min(208px, 100%)",
                  height: "auto",
                  marginTop: 26,
                  // The laurels are a dark PNG inside the SVG — force the whole
                  // mark (laurels + already-white text) to pure white.
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>

            {/* Services */}
            <div>
              <ColumnHeading>Services</ColumnHeading>
              <div className="flex flex-col gap-3">
                {servicesLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href} label={link.label} />
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <ColumnHeading>Resources</ColumnHeading>
              <div className="flex flex-col gap-3">
                {resourcesLinks.map((link) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    badge={link.badge}
                  />
                ))}
              </div>
            </div>

            {/* Our Office */}
            <div>
              <ColumnHeading>Our Office</ColumnHeading>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 12.9,
                  color: "var(--sp-navy-300)",
                }}
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M12 7.5V12l3 2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Mon–Fri 10am–10pm
              </div>
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 11.5,
                  color: "var(--sp-navy-400)",
                  marginTop: 16,
                  lineHeight: 1.45,
                }}
              >
                5th Block, SPD Plaza, #52, 1st Floor,
                <br />
                Koramangala, Bangalore 560034
                <br />
                info@summentorpro.com · 080-41574773
              </p>
            </div>
          </div>
        </Container>

        {/* Watermark band — oversized outline words, each followed by an
            engagement photo, as one centred row that runs off both edges. */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            marginTop: "clamp(8px, 2vw, 20px)",
            paddingBlock: "clamp(20px, 3vw, 36px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(12px, 2.2vw, 30px)",
              whiteSpace: "nowrap",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--sp-font-display)",
                fontSize: "clamp(42px, 8.28vw, 118px)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "0.01em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.16)",
              }}
            >
              Enterprise
            </span>
            <img
              src="/images/engagements/textile-women-empowerment-odisha.jpeg"
              alt="Summentor Pro engagement"
              style={{
                flexShrink: 0,
                width: "clamp(108px, 14vw, 168px)",
                height: "clamp(64px, 8.5vw, 92px)",
                objectFit: "cover",
                borderRadius: 0,
                transform: "translateY(10px)",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--sp-font-display)",
                fontSize: "clamp(42px, 8.28vw, 118px)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "0.01em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.16)",
              }}
            >
              Leadership
            </span>
            <img
              src="/images/engagements/msme-consulting-2.jpeg"
              alt="Summentor Pro engagement"
              style={{
                flexShrink: 0,
                width: "clamp(108px, 14vw, 168px)",
                height: "clamp(64px, 8.5vw, 92px)",
                objectFit: "cover",
                borderRadius: 0,
                transform: "translateY(10px)",
              }}
            />
          </div>
        </div>

        {/* Bottom bar — social icons centred, copyright left, legal right */}
        <Container style={{ maxWidth: 1320 }}>
          <div
            className="relative flex flex-col items-center gap-5"
            style={{
              borderTop: "1px solid var(--sp-navy-700)",
              paddingTop: 24,
              marginTop: "clamp(8px, 2vw, 20px)",
            }}
          >
            {/* Social icons (centred on every breakpoint) */}
            <div className="flex gap-3.5">
              {SOCIALS.map((s) => (
                <SocialIcon key={s.label} label={s.label} href={s.href} path={s.path} />
              ))}
            </div>

            {/* Copyright — pinned left on desktop, stacked + centred on mobile */}
            <div
              className="lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2"
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 12,
                color: "var(--sp-navy-400)",
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} Summentor Pro Business Consultants. All rights reserved.
            </div>

            {/* Legal + admin — pinned right on desktop */}
            <div
              className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
              style={{ fontFamily: "var(--sp-font-sans)", fontSize: 12 }}
            >
              <Link
                href="/privacy-policy"
                style={{ color: "var(--sp-navy-300)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#17d99d")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sp-navy-300)")}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                style={{ color: "var(--sp-navy-300)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#17d99d")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sp-navy-300)")}
              >
                Terms &amp; Condition
              </Link>
              <Link
                href="/admin/dashboard"
                style={{
                  color: "var(--sp-navy-600)",
                  textDecoration: "none",
                  fontSize: 10.1,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#17d99d")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sp-navy-600)")}
              >
                Admin
              </Link>
            </div>
          </div>
        </Container>

        <style>{`
          .sp-news-input::placeholder { color: var(--sp-navy-300); opacity: 1; }
        `}</style>
      </footer>
    </>
  );
}
