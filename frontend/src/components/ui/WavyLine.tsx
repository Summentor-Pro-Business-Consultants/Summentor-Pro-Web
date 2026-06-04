interface WavyLineProps {
  /** Rendered width (px or any CSS length). */
  width?: string | number;
  /** Margin above the line, in px or any CSS length. */
  marginTop?: number | string;
}

/**
 * Brand wavy line — the green curvy underline used in the design PDFs
 * beneath centered section headings. Sources /icons/Untitled-1.svg so
 * the asset itself stays the single source of truth.
 */
// Default sits flush against the heading above — the SVG itself carries
// extra whitespace inside its viewBox, so any positive marginTop reads
// as a much larger visual gap than the px value suggests.
export default function WavyLine({ width = 180, marginTop = 0 }: WavyLineProps) {
  const w = typeof width === "number" ? `${width}px` : width;
  const mt = typeof marginTop === "number" ? `${marginTop}px` : marginTop;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/Untitled-1.svg"
      alt=""
      aria-hidden="true"
      style={{
        display: "block",
        width: w,
        height: "auto",
        margin: `${mt} auto 0`,
        pointerEvents: "none",
      }}
    />
  );
}
