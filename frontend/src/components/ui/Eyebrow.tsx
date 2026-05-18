import React, { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  gold?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Eyebrow({ children, gold = true, className = "", style }: EyebrowProps) {
  return (
    <div
      className={`sp-eyebrow ${className}`}
      style={{ color: gold ? "var(--sp-gold-700)" : "var(--sp-navy-300)", ...style }}
    >
      {children}
    </div>
  );
}
