import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  wide?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Container({ children, wide, className = "", style }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-6 lg:px-8 ${className}`}
      style={{ maxWidth: wide ? 1440 : 1200, ...style }}
    >
      {children}
    </div>
  );
}
