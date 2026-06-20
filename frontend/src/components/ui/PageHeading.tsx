import type { ReactNode, CSSProperties } from "react";

interface PageHeadingProps {
  children: ReactNode;
  /** Optional style overrides (use sparingly). */
  style?: CSSProperties;
  /** Optional className passthrough. */
  className?: string;
}

/**
 * Canonical page hero heading — the big white h1 that opens every page
 * ("BUILDING STRATEGIC PLATFORMS FOR…", "STRATEGIC SOLUTIONS DESIGNED
 * FOR…", etc). All page heroes route through this so the size, weight,
 * tracking, line-height, and alignment are guaranteed identical. Renders
 * rich children — the inline green typewriter <span> goes inside directly.
 */
export default function PageHeading({ children, style, className }: PageHeadingProps) {
  return (
    <h1
      className={className}
      style={{
        fontFamily: "var(--sp-font-sans)",
        fontSize: "clamp(40px, 7vw, 88px)",
        fontWeight: 900,
        letterSpacing: "0.005em",
        textTransform: "uppercase",
        color: "#fff",
        lineHeight: 1.02,
        textAlign: "center",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h1>
  );
}
