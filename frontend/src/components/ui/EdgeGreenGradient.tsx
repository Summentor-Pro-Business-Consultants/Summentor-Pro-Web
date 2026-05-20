/**
 * EdgeGreenGradient — soft full-height green wash anchored to one side of
 * its containing section. Used across light/white sections to add subtle
 * atmospheric depth consistent with the brand. The parent must be
 * `position: relative` + `overflow: hidden`, and any in-flow content that
 * should appear above the wash needs its own `position: relative`.
 */
interface EdgeGreenGradientProps {
  side?: "right" | "left";
  width?: string;
  intensity?: number;
}

export default function EdgeGreenGradient({
  side = "right",
  width = "38%",
  intensity = 0.22,
}: EdgeGreenGradientProps) {
  const dir = side === "right" ? "270deg" : "90deg";
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side]: 0,
        width,
        background: `linear-gradient(${dir}, rgba(34,197,94,${intensity}) 0%, rgba(34,197,94,${intensity * 0.28}) 55%, transparent 100%)`,
        pointerEvents: "none",
      }}
    />
  );
}
