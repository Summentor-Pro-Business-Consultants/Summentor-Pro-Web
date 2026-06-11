interface WavyLineProps {
  /** Rendered width (px or any CSS length). */
  width?: string | number;
  /** Margin above the line, in px or any CSS length. */
  marginTop?: number | string;
  /** Horizontal stretch factor — >1 makes the squiggle wider/flatter. */
  stretch?: number;
  /** Horizontal nudge from centre, in px. Positive = right, negative = left. */
  offsetX?: number;
}

/**
 * Brand wavy line — the green curvy underline used in the design PDFs
 * beneath centered section headings. Sources /icons/Untitled-1.svg so
 * the asset itself stays the single source of truth.
 */
// Negative default — the SVG carries ~20–30px of empty space inside
// its viewBox above the actual green stroke, so the rendered image
// already looks far below the heading even at marginTop:0. Pulling it
// up with a negative margin closes that visual gap.
//
// `stretch` applies a horizontal scaleX so the line widens without
// getting any taller (keeping the gap below the heading unchanged).
export default function WavyLine({
  width = 180,
  marginTop = -3,
  stretch = 1.3,
  offsetX = 44,
}: WavyLineProps) {
  const w = typeof width === "number" ? `${width}px` : width;
  const mt = typeof marginTop === "number" ? `${marginTop}px` : marginTop;
  return (
    <img
      src="/icons/Untitled-1.svg"
      alt=""
      aria-hidden="true"
      style={{
        display: "block",
        width: w,
        height: "auto",
        margin: `${mt} auto 0`,
        position: "relative",
        left: offsetX,
        transform: `scaleX(${stretch})`,
        transformOrigin: "center",
        pointerEvents: "none",
      }}
    />
  );
}
