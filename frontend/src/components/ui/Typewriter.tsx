"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  /** Final text to type out. */
  text: string;
  /** Milliseconds between each character. */
  speed?: number;
  /** Milliseconds to wait before the first character appears. */
  startDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Typewriter — reveals `text` one character at a time.
 * No caret/cursor — just letters appearing in sequence.
 */
export default function Typewriter({
  text,
  speed = 55,
  startDelay = 0,
  className,
  style,
}: TypewriterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            if (intervalId) clearInterval(intervalId);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className} style={style}>
      {text.slice(0, count)}
    </span>
  );
}
