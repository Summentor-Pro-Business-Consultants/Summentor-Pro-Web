"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import PageHeading from "@/components/ui/PageHeading";
import Typewriter from "@/components/ui/Typewriter";

// Background hero video (lives in /public/videos) — compressed 720p H.264
// loop (~8 MB, down from the 100 MB master) tuned for a muted, half-opacity
// background under the dark overlay.
const HERO_VIDEO = "/videos/spro-website.mp4";
const HERO_POSTER = "/images/engagements/msme-consulting-2.jpeg";

export default function Hero() {
  // The hero video is a muted, decorative background loop, so it always plays
  // regardless of the reduced-motion preference. React doesn't reliably set
  // the `muted` *property* on <video>, which makes browsers block autoplay, so
  // we force muted + kick off play() imperatively.
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const p = v.play();
    if (p) p.catch(() => {});
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--sp-dark-grad-a)",
        // Right-bottom slant → bottom-LEFT raised, dark extends further on the
        // RIGHT. Matches the home-page PDF where the dark hero's bottom edge
        // slopes down toward the right.
        clipPath:
          "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - var(--sp-slant)))",
      }}
    >

      {/* Background hero video — always autoplays muted on loop. The poster
          (first conference photo) shows only while the video buffers, so there
          is never a blank frame. */}
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
          opacity: 0.65,
        }}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(8,8,8,0.62) 0%, rgba(8,8,8,0.4) 60%, rgba(8,8,8,0.55) 100%)",
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

      <Container style={{ position: "relative", zIndex: 1, paddingTop: "clamp(56px, 8vw, 80px)", paddingBottom: "clamp(56px, 8vw, 80px)" }}>
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
                background: "var(--sp-green-700)",
                color: "#fff",
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
              <Typewriter text="Business Growth" startDelay={600} />
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
            <Link href="/services" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 17,
                  fontWeight: 500,
                  color: "#fff",
                  background: "transparent",
                  border: "2px solid var(--sp-green-500)",
                  borderRadius: 999,
                  padding: "14px 36px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "var(--sp-green-500)";
                  el.style.color = "var(--sp-navy-900)";
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

            {/* Partner With Us — solid white pill, dark text */}
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 17,
                  fontWeight: 500,
                  color: "var(--sp-navy-900)",
                  background: "#fff",
                  border: "2px solid #fff",
                  borderRadius: 999,
                  padding: "14px 36px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "var(--sp-green-500)";
                  el.style.borderColor = "var(--sp-green-500)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "#fff";
                  el.style.borderColor = "#fff";
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
