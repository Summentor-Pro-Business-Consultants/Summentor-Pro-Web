import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";
import ProcessSection from "@/components/sections/ProcessSection";
import EngagementCTA from "@/components/sections/EngagementCTA";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import { Target, Users, TrendingUp, Lightbulb, Shield, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Summentor Pro",
  description:
    "Learn about Summentor Pro — founded by Nitika Shahi and Suhaib Ahmed to elevate Indian businesses through strategic consulting, events, and partnerships.",
};

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    desc: "Built with purpose, driven by passion. Every engagement is guided by a clear intent to create lasting impact.",
  },
  {
    icon: Users,
    title: "Collaboration",
    desc: "We believe in mutual growth and true partnership — your success is our success.",
  },
  {
    icon: TrendingUp,
    title: "Results-Oriented",
    desc: "Data-driven strategies with measurable outcomes. We track what matters and adjust continuously.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Staying ahead of industry trends ensures our clients always have access to the most relevant solutions.",
  },
  {
    icon: Shield,
    title: "Integrity",
    desc: "Confidentiality, transparency, and ethical practice are non-negotiable foundations of every engagement.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    desc: "We aim to create lasting legacies — not just short-term wins — for businesses and communities alike.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page hero */}
      <section
        style={{
          background: "var(--sp-navy-900)",
          color: "#fff",
          padding: "80px 0 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="/assets/img-skyline.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />
        <Container style={{ position: "relative", zIndex: 1 }}>
          <Eyebrow gold={false} style={{ color: "var(--sp-gold-500)" }}>
            OUR STORY
          </Eyebrow>
          <h1
            style={{
              fontFamily: "var(--sp-font-serif)",
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 400,
              letterSpacing: "var(--sp-track-display)",
              lineHeight: 1.1,
              color: "#fff",
              marginTop: 16,
              maxWidth: 700,
            }}
          >
            About Summentor Pro
          </h1>
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 18,
              lineHeight: 1.65,
              color: "var(--sp-navy-200)",
              marginTop: 20,
              maxWidth: 580,
            }}
          >
            A growth advisory firm founded with a singular mission — to elevate Indian businesses
            through personalized strategies, real connections, and policy-level impact.
          </p>
        </Container>
      </section>

      <AboutSection />

      {/* Core values */}
      <Section>
        <Container>
          <div className="text-center mb-14">
            <Eyebrow className="justify-center">OUR VALUES</Eyebrow>
            <h2
              style={{
                fontFamily: "var(--sp-font-serif)",
                fontSize: "clamp(26px, 3.5vw, 38px)",
                fontWeight: 400,
                letterSpacing: "var(--sp-track-h2)",
                color: "var(--sp-navy-900)",
                marginTop: 12,
              }}
            >
              What we stand for.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex gap-4 p-6 rounded"
                style={{
                  border: "1px solid var(--sp-gray-200)",
                  background: "var(--sp-gray-50)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "var(--sp-gold-100)",
                    borderRadius: "var(--sp-radius)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--sp-gold-700)",
                    flexShrink: 0,
                  }}
                >
                  <value.icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--sp-navy-900)",
                      marginBottom: 6,
                    }}
                  >
                    {value.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "var(--sp-gray-600)",
                    }}
                  >
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ProcessSection />
      <EngagementCTA />
    </>
  );
}
