import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  dark?: boolean;
  tint?: boolean;
  py?: number;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Section({
  children,
  dark,
  tint,
  py = 96,
  id,
  className = "",
  style,
}: SectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        background: dark ? "var(--sp-navy-900)" : tint ? "var(--sp-gray-50)" : "#fff",
        color: dark ? "#fff" : "inherit",
        paddingTop: py,
        paddingBottom: py,
        ...style,
      }}
    >
      {children}
    </section>
  );
}
