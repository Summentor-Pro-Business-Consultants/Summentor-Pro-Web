import Container from "@/components/ui/Container";

/**
 * LegalLayout — shared chrome for the static legal / policy pages
 * (Privacy Policy, Terms of Service, Disclaimer, Refund & Cancellation Policy,
 * Cookies Policy).
 *
 * It mirrors the blog detail page: a dark hero with the document title and an
 * optional "Last Updated" line, followed by a centred, max-width prose column.
 * Long-form typography is scoped to `.legal-prose` (defined in the <style>
 * block below) so every policy page reads consistently.
 *
 * These pages are plain server components (no client JS) — better for SEO and
 * faster to render, since the content is fully static.
 */
export default function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      {/* Hero */}
      <div
        style={{
          background: "var(--sp-navy-1000, #050d1a)",
          padding: "clamp(48px, 7vw, 76px) 0 clamp(36px, 5vw, 52px)",
          borderBottom: "1px solid var(--sp-navy-800)",
        }}
      >
        <Container>
          <div
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#17d99d",
              marginBottom: 14,
            }}
          >
            Legal
          </div>
          <h1
            style={{
              fontFamily: "var(--sp-font-display)",
              fontSize: "clamp(26px, 3.68vw, 42px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "var(--sp-track-h1)",
              margin: 0,
            }}
          >
            {title}
          </h1>
          {lastUpdated && (
            <p
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 12,
                color: "var(--sp-navy-300)",
                marginTop: 16,
              }}
            >
              Last Updated: {lastUpdated}
            </p>
          )}
        </Container>
      </div>

      {/* Body */}
      <div style={{ padding: "clamp(40px, 6vw, 64px) 0 clamp(56px, 8vw, 88px)" }}>
        <Container>
          <div className="legal-prose" style={{ maxWidth: 820, margin: "0 auto" }}>
            {children}
          </div>
        </Container>
      </div>

      <style>{`
        .legal-prose { font-family: var(--sp-font-sans); font-size: 1.0625rem; line-height: 1.6; color: var(--sp-navy-800, #1f1f1f); }
        .legal-prose h2 { font-size: 1.45em; font-weight: 600; margin: 1.9em 0 0.5em; color: #000; line-height: 1.18; letter-spacing: -0.01em; }
        .legal-prose h2:first-child { margin-top: 0; }
        .legal-prose h3 { font-size: 1.12em; font-weight: 600; margin: 1.5em 0 0.35em; color: #000; line-height: 1.2; }
        .legal-prose p { font-size: 1em; margin: 0 0 1.05em; }
        .legal-prose p:last-child { margin-bottom: 0; }
        .legal-prose ul { list-style: disc; padding-left: 1.4em; margin: 0.4em 0 1.2em; }
        .legal-prose li { margin-bottom: 0.45em; }
        .legal-prose li::marker { color: #05a171; }
        .legal-prose a { color: #05a171; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: #05a171; }
        .legal-prose a:hover { color: #047a54; }
        .legal-prose strong { font-weight: 700; color: #000; }
      `}</style>
    </article>
  );
}
