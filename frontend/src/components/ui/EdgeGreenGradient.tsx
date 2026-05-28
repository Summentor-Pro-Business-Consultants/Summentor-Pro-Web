/**
 * EdgeGreenGradient — a circular green spotlight anchored to one side of
 * its containing section. Used on light sections to draw the eye toward
 * important content (headings, CTAs, etc.) without painting a slab of
 * colour across the whole edge. The parent must be `position: relative`
 * + `overflow: hidden`, and any in-flow content that should appear above
 * the glow needs its own `position: relative`.
 */
interface EdgeGreenGradientProps {
  side?: "right" | "left";
  /** Vertical anchor — defaults to middle so the glow sits near hero/heading content. */
  position?: "top" | "middle" | "bottom";
  intensity?: number;
  /** Diameter of the glow in viewport-width units; clamped between 300px and 720px. */
  size?: string;
}

export default function EdgeGreenGradient({
  side = "right",
  position = "middle",
  intensity = 0.18,
  size = "clamp(300px, 42vw, 720px)",
}: EdgeGreenGradientProps) {
  const verticalAnchor =
    position === "top" ? { top: "-12%" } : position === "bottom" ? { bottom: "-12%" } : { top: "50%", transform: "translateY(-50%)" };

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        [side]: "-10%",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(34,197,94,${intensity}) 0%, rgba(34,197,94,${intensity * 0.35}) 35%, transparent 70%)`,
        pointerEvents: "none",
        ...verticalAnchor,
      }}
    />
  );
}
