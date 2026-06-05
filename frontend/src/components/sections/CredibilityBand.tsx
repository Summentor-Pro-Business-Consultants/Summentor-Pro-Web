"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const letters = [
  {
    label: "Support Letter — Ministry of MSME",
    img: "/images/letters/ministry-msme.jpg",
  },
  {
    label: "Supporting Letter — Government of Delhi",
    img: "/images/letters/govt-delhi.jpg",
  },
  {
    label: "Supporting Letter — Ministry of Housing & Urban Affairs",
    img: "/images/letters/ministry-housing-urban-affairs.jpg",
  },
  {
    label: "Supporting Letter — Ministry of Housing & Urban Affairs (2)",
    img: "/images/letters/ministry-housing-urban-affairs-2.jpg",
  },
];

const meetingPhotos = [
  { src: "/images/engagements/meeting-union-minister-msme.jpeg", caption: "Meeting with Union Minister of MSME" },
  { src: "/images/engagements/meeting-cm-delhi.jpeg", caption: "Meeting with Chief Minister, Delhi" },
  { src: "/images/engagements/meeting-defence-minister.jpeg", caption: "Meeting with Defence Minister" },
  { src: "/images/engagements/meeting-deputy-cm-odisha.jpeg", caption: "Meeting with Deputy CM, Odisha" },
  { src: "/images/engagements/meeting-mos-msme.jpeg", caption: "Meeting with Minister of State for MSME" },
];

const companies = [
  { name: "ACKO General Insurance",  logo: "/logos/acko.png",        fallback: "https://logo.clearbit.com/acko.com" },
  { name: "Cashfree Payments",       logo: "/logos/cashfree.png",    fallback: "https://logo.clearbit.com/cashfree.com" },
  { name: "Clear",                   logo: "/logos/clear.png",       fallback: "https://logo.clearbit.com/clear.in" },
  { name: "Dalmia Cement",           logo: "/logos/dalmia.png",      fallback: "https://logo.clearbit.com/dalmiacement.com" },
  { name: "East West Seed",          logo: "/logos/eastwestseed.png",fallback: "https://logo.clearbit.com/eastwestseed.com" },
  { name: "Godrej & Boyce",          logo: "/logos/godrej.png",      fallback: "https://logo.clearbit.com/godrejenterprises.com" },
  { name: "ISB",                     logo: "/logos/isb.png",         fallback: "https://logo.clearbit.com/isb.edu" },
  { name: "Paytm",                   logo: "/logos/paytm.png",       fallback: "https://logo.clearbit.com/paytm.com" },
  { name: "PhonePe",                 logo: "/logos/phonepe.png",     fallback: "https://logo.clearbit.com/phonepe.com" },
  { name: "Polycab",                 logo: "/logos/polycab.png",     fallback: "https://logo.clearbit.com/polycab.com" },
  { name: "Sproutlife Foods",        logo: "/logos/yogabars.png",    fallback: "https://logo.clearbit.com/yogabars.in" },
  { name: "State Bank of India",     logo: "https://logo.clearbit.com/sbi.co.in", fallback: "https://logo.clearbit.com/onlinesbi.sbi" },
  { name: "Tata Steel",              logo: "/logos/tatasteel.png",   fallback: "https://logo.clearbit.com/tatasteel.com" },
  { name: "TATA Teleservices",       logo: "/logos/tatatele.png",    fallback: "https://logo.clearbit.com/tatatelebusiness.com" },
  { name: "Zaggle",                  logo: "/logos/zaggle.png",      fallback: "https://logo.clearbit.com/zaggle.in" },
  { name: "Zetwerk",                 logo: "/logos/zetwerk.png",     fallback: "https://logo.clearbit.com/zetwerk.com" },
];

export default function CredibilityBand() {
  const [current, setCurrent] = useState(0);
  const perPage = 3;
  const maxIndex = letters.length - perPage; // 4 - 3 = 1, so positions 0 and 1
  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));
  const visibleLetters = letters.slice(current, current + perPage);

  return (
    <section style={{ background: "#fff", paddingTop: "clamp(56px, 8vw, 80px)", paddingBottom: "clamp(56px, 8vw, 80px)" }}>
      <Container>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
          style={{ marginBottom: 48 }}
        >
          <SectionHeading>
            TRUSTED BY ECOSYSTEM STAKEHOLDERS,
            <br />
            INDUSTRY LEADERS &amp; BUSINESSES
          </SectionHeading>
          <WavyLine />
        </motion.div>

        {/* Government support letter cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: 20 }}>
          {visibleLetters.map((letter, i) => (
            <motion.a
              key={letter.img}
              href={letter.img}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "block",
                textDecoration: "none",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                background: "#fff",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.13)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* JPG preview — clean, no dark borders */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "210 / 297", overflow: "hidden", background: "#fff" }}>
                <Image
                  src={letter.img}
                  alt={letter.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              {/* Card footer */}
              <div
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 14,
                    color: "#6B7280",
                    margin: 0,
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {letter.label}
                </p>
                <span
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--sp-green-600)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  View →
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Carousel navigation */}
        <div className="flex justify-center items-center gap-4" style={{ marginBottom: 64 }}>
          <button
            onClick={prev}
            disabled={current === 0}
            style={{
              background: "none",
              border: "1px solid #D1D5DB",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: current === 0 ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: current === 0 ? 0.35 : 1,
              transition: "opacity 0.2s",
            }}
          >
            <ChevronLeft size={16} color="#374151" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: i === current ? "var(--sp-green-500)" : "#D1D5DB",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={current === maxIndex}
            style={{
              background: "none",
              border: "1px solid #D1D5DB",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: current === maxIndex ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: current === maxIndex ? 0.35 : 1,
              transition: "opacity 0.2s",
            }}
          >
            <ChevronRight size={16} color="#374151" />
          </button>
        </div>

        {/* Meeting photos strip */}
        <div style={{ marginBottom: 64 }}>
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Government & Industry Engagements
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {meetingPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid #E5E7EB",
                  background: "#F9FAFB",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: 130 }}>
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "8px 10px" }}>
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 11,
                      color: "#6B7280",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company names ticker */}
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 40 }}>
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Trusted by leading businesses across India
          </p>
          <div style={{ overflow: "hidden" }}>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
              className="flex items-center"
              style={{ width: "max-content", gap: 56 }}
            >
              {[...companies, ...companies].map((co, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                  }}
                >
                  {/* Raw img kept: onError fallback chain to remote logo CDNs */}
                  <img
                    src={co.logo}
                    alt={co.name}
                    style={{
                      height: 32,
                      width: "auto",
                      maxWidth: 80,
                      objectFit: "contain",
                      filter: "none",
                      opacity: 1,
                    }}
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      const domain = co.fallback.replace("https://logo.clearbit.com/", "");
                      const googleFavicon = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=256`;
                      if (!el.dataset.tried) {
                        el.dataset.tried = "1";
                        el.src = co.fallback;
                      } else if (el.dataset.tried === "1") {
                        el.dataset.tried = "2";
                        el.src = googleFavicon;
                      } else {
                        el.style.display = "none";
                      }
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#9CA3AF",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {co.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
