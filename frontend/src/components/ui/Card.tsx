import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  premium?: boolean;
  padding?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  premium,
  padding = 28,
  className = "",
  style,
}: CardProps) {
  return (
    <div
      className={`relative overflow-hidden transition-all duration-200 ${className}`}
      style={{
        background: premium ? "var(--sp-navy-900)" : "#fff",
        color: premium ? "#fff" : "inherit",
        border: premium ? "none" : "1px solid var(--sp-gray-200)",
        borderRadius: "var(--sp-radius-md)",
        padding,
        boxShadow: premium ? "var(--sp-shadow-lg)" : "var(--sp-shadow-sm)",
        ...style,
      }}
    >
      {premium && (
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: 3, background: "var(--sp-gold-500)" }}
        />
      )}
      {children}
    </div>
  );
}
