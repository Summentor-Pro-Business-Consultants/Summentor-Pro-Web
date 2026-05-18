import { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "dark" | "secondary" | "secondaryDark" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--sp-gold-500)",
    color: "var(--sp-navy-900)",
    border: "1px solid var(--sp-gold-500)",
  },
  dark: { background: "var(--sp-navy-900)", color: "#fff", border: "1px solid var(--sp-navy-900)" },
  secondary: {
    background: "#fff",
    color: "var(--sp-navy-900)",
    border: "1px solid var(--sp-gray-300)",
  },
  secondaryDark: {
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
  },
  ghost: {
    background: "transparent",
    color: "var(--sp-navy-900)",
    border: "1px solid transparent",
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { height: 36, padding: "0 14px", fontSize: 13 },
  md: { height: 44, padding: "0 20px", fontSize: 14 },
  lg: { height: 52, padding: "0 28px", fontSize: 15 },
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  fullWidth,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        fontFamily: "var(--sp-font-sans)",
        fontWeight: 500,
        borderRadius: "var(--sp-radius)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
        width: fullWidth ? "100%" : undefined,
        ...style,
      }}
    >
      {children}
      {icon && <span className="flex">{icon}</span>}
    </button>
  );
}
