"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

// Full-bleed autoplaying muted background video for page heroes, with a still
// poster fallback for reduced-motion visitors. Renders the video for SSR + the
// first client paint (so there's no hydration mismatch), then swaps to the
// still after mount when the visitor prefers reduced motion. Meant to sit as
// the first child of a `position: relative` hero section, behind the overlay.
export default function HeroVideoBackground({
  src,
  poster,
  opacity = 0.8,
  objectPosition = "center",
}: {
  src: string;
  poster: string;
  opacity?: number;
  objectPosition?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const showStill = mounted && reduceMotion;

  // React doesn't reliably set the `muted` *property*, which makes browsers
  // block autoplay, so force muted + kick off play() imperatively.
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || showStill) return;
    v.muted = true;
    v.defaultMuted = true;
    const p = v.play();
    if (p) p.catch(() => {});
  }, [showStill]);

  if (showStill) {
    return (
      <Image
        src={poster}
        alt=""
        aria-hidden="true"
        fill
        quality={100}
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition, opacity }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition,
        opacity,
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
