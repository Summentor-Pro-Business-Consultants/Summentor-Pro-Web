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

  // Fade the backdrop up from the section's dark gradient so nothing "pops" in.
  //
  // This deliberately triggers on mount rather than on `canplay`: the poster
  // paints inside the <video> element, so fading on canplay would keep the
  // poster hidden until the video buffered — exactly what the poster exists to
  // avoid. Starting the fade immediately means the poster arrives mid-fade, and
  // because the poster IS the video's first frame, the later hand-off to actual
  // playback is invisible.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Two frames so the initial opacity:0 is painted before the transition runs.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // Reduced-motion visitors get the still at full strength with no fade.
  const fadeStyle = reduceMotion
    ? { opacity }
    : { opacity: visible ? opacity : 0, transition: "opacity 0.7s ease-out" };

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
        style={{ objectFit: "cover", objectPosition, ...fadeStyle }}
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
        ...fadeStyle,
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
