"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import PageHeading from "@/components/ui/PageHeading";
import { trackEvent } from "@/lib/tracking";

// Background hero video (lives in /public/videos), tuned for a muted,
// half-opacity background under the dark overlay. Each page has its own film —
// home.mp4 here, about/solutions/platforms.mp4 on their respective pages.
const HERO_VIDEO = "/videos/home.mp4";
// The video's own first frame, so the still-to-playback hand-off is invisible.
const HERO_POSTER = "/images/video-posters/home.jpg";

export default function Hero() {
  const pathname = usePathname();
  // Production-grade reduced-motion handling: an autoplaying background video
  // is exactly the kind of large, continuous motion that should NOT play for
  // visitors who ask for reduced motion — they get the still poster instead.
  // Render the video for SSR + the first client paint (mounted === false) so
  // there is no hydration mismatch, then swap to the still after mount if the
  // visitor prefers reduced motion.
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const showStill = mounted && reduceMotion;

  // Fade the backdrop up from the dark gradient so nothing pops in. Triggered
  // on mount, not on `canplay`: the poster paints inside the <video>, so
  // waiting for playback would hide the poster — the very thing it's there for.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);
  const fadeStyle = reduceMotion
    ? { opacity: 0.85 }
    : { opacity: visible ? 0.85 : 0, transition: "opacity 0.7s ease-out" };

  // React doesn't reliably set the `muted` *property* on <video>, which makes
  // browsers block autoplay, so force muted + kick off play() imperatively
  // whenever the video is the one being rendered.
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || showStill) return;
    v.muted = true;
    v.defaultMuted = true;
    const p = v.play();
    if (p) p.catch(() => {});
  }, [showStill]);

  return (
    <section
      style={{
        position: "relative",
        // Paints above AboutSection, which slides up behind this slanted
        // bottom so its grid fills the cut-out wedge.
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--sp-dark-grad-a)",
        // Bottom slant rises to the RIGHT → bottom-RIGHT raised, dark extends
        // further on the LEFT (the dark hero's bottom edge slopes down toward
        // the left).
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - var(--sp-slant)), 0 100%)",
      }}
    >
      {/* Background — autoplaying muted video loop for default visitors; a
          still poster for reduced-motion visitors. The poster also shows while
          the video buffers, so there is never a blank frame. */}
      {showStill ? (
        <Image
          src={HERO_POSTER}
          alt=""
          aria-hidden="true"
          fill
          quality={100}
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center", ...fadeStyle }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            ...fadeStyle,
          }}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.28) 60%, rgba(8,8,8,0.4) 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to bottom, transparent, rgba(8,8,8,0.85))",
        }}
      />

      <Container
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "clamp(56px, 8vw, 80px)",
          paddingBottom: "clamp(56px, 8vw, 80px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center" }}
        >
          <PageHeading>
            BUILDING STRATEGIC
            <br />
            PLATFORMS FOR
            <br />
            <span
              style={{
                display: "inline-block",
                background: "var(--sp-green)",
                color: "#000",
                fontStyle: "italic",
                fontWeight: 700,
                padding: "4px 20px 4px 16px",
                marginTop: -10,
                // Slight counter-clockwise tilt to match the design — right
                // edge lifts above the left so the block reads as dynamic
                // rather than static.
                transform: "rotate(-3deg)",
                transformOrigin: "center",
              }}
            >
              Business Growth
            </span>
          </PageHeading>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 justify-center"
            style={{ marginTop: 52 }}
          >
            {/* Explore Solutions — green outlined pill, transparent fill */}
            <Link
              href="/services"
              style={{ textDecoration: "none" }}
              onClick={() =>
                void trackEvent("cta_click", pathname, {
                  label: "Explore Solutions",
                  properties: { href: "/services", location: "hero" },
                })
              }
            >
              <button
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 24,
                  fontWeight: 400,
                  color: "#fff",
                  background: "transparent",
                  border: "2px solid var(--sp-green)",
                  borderRadius: 999,
                  padding: "12px 44px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "var(--sp-green)";
                  el.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "transparent";
                  el.style.color = "#fff";
                }}
              >
                Explore Solutions
              </button>
            </Link>

            {/* Partner With Us — green outlined pill, transparent fill */}
            <Link
              href="/contact"
              style={{ textDecoration: "none" }}
              onClick={() =>
                void trackEvent("cta_click", pathname, {
                  label: "Partner With Us",
                  properties: { href: "/contact", location: "hero" },
                })
              }
            >
              <button
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 24,
                  fontWeight: 400,
                  color: "#fff",
                  background: "transparent",
                  border: "2px solid var(--sp-green)",
                  borderRadius: 999,
                  padding: "12px 44px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "var(--sp-green)";
                  el.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "transparent";
                  el.style.color = "#fff";
                }}
              >
                Partner With Us
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
