import type { Metadata } from "next";
import Link from "next/link";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProcessSection from "@/components/sections/ProcessSection";
import EngagementCTA from "@/components/sections/EngagementCTA";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Target,
  Users,
  Building2,
  Award,
  Globe,
  Handshake,
  FileText,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services | Summentor Pro",
  description:
    "Explore Summentor Pro's full suite of B2B consulting, event management, government relations, brand building, and MSME advisory services.",
};

const serviceDetails = [
  {
    id: "consulting",
    icon: Target,
    title: "Strategic Consulting",
    subtitle: "B2B & B2G Growth Strategy",
    desc: "We craft tailored growth strategies for businesses at every stage — from startups finding product-market fit to established enterprises entering new verticals. Our consulting goes beyond advice: we embed with your leadership to architect operating systems, competitive positioning, and scalable business models.",
    outcomes: [
      "Market entry strategies",
      "Competitive analysis & positioning",
      "Revenue diversification plans",
      "Operational efficiency frameworks",
    ],
  },
  {
    id: "events",
    icon: Users,
    title: "B2B Events & Summits",
    subtitle: "Industry Conferences & Networking",
    desc: "We design, curate, and execute high-impact B2B events — from intimate roundtables to large-scale industry summits. Our events connect founders with investors, policymakers, and strategic partners in structured environments that drive real business outcomes.",
    outcomes: [
      "Industry conferences & trade shows",
      "Invite-only founder summits",
      "Monthly networking meetups",
      "Government-industry roundtables",
    ],
  },
  {
    id: "government",
    icon: Building2,
    title: "Government Relations",
    subtitle: "Policy Navigation & Tender Management",
    desc: "Navigating India's regulatory landscape requires experience and relationships. Our government relations desk provides direct access to policy advisors, helps businesses qualify for government schemes, and manages the end-to-end process of government tenders.",
    outcomes: [
      "Policy navigation & compliance",
      "Government tender management",
      "Regulatory approvals support",
      "Ecosystem opportunity mapping",
    ],
  },
  {
    id: "branding",
    icon: Award,
    title: "Brand Building",
    subtitle: "MSME Visibility & Market Expansion",
    desc: "We build the credibility infrastructure that B2B brands need to win enterprise contracts, government tenders, and strategic partnerships. From executive positioning to category narrative — we make your brand stand out in a crowded market.",
    outcomes: [
      "B2B brand positioning",
      "Executive thought leadership",
      "Media & PR strategy",
      "Digital presence optimization",
    ],
  },
  {
    id: "marketing",
    icon: Globe,
    title: "Marketing & Strategic Relations",
    subtitle: "Growth Strategies & Relationship Management",
    desc: "Our marketing practice focuses on relationship-led growth — building the connections and programs that generate sustained business development. We combine data-driven marketing with deep relationship management across industries.",
    outcomes: [
      "Go-to-market strategy",
      "Strategic relationship mapping",
      "Partnership program design",
      "Account-based marketing",
    ],
  },
  {
    id: "connect",
    icon: Handshake,
    title: "Lead Generation (Connect Now)",
    subtitle: "Curated B2B Networking & Partnerships",
    desc: "Through our proprietary Connect Now program, we curate high-intent B2B introductions based on strategic fit — not just industry overlap. Monthly meetups and verified partner networks ensure your pipeline is always warm.",
    outcomes: [
      "Qualified B2B introductions",
      "Verified channel partnerships",
      "Monthly networking sessions",
      "Investor-founder matching",
    ],
  },
  {
    id: "msme",
    icon: FileText,
    title: "MSME Tenders & Initiatives",
    subtitle: "Tender Access & Subsidy Advisory",
    desc: "India's MSME ecosystem offers significant government support — but accessing it requires expertise. We guide businesses through eligibility assessment, application preparation, and scheme execution for government tenders, subsidies, and MSME initiatives.",
    outcomes: [
      "Government scheme eligibility",
      "Tender documentation & filing",
      "Subsidy application support",
      "MSME certification advisory",
    ],
  },
];

export default function ServicesPage() {
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
        <Container style={{ position: "relative", zIndex: 1 }}>
          <Eyebrow gold={false} style={{ color: "var(--sp-gold-500)" }}>
            WHAT WE DO
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
            Our Services
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
            Seven integrated disciplines designed to drive sustainable business growth across
            consulting, events, government relations, and strategic partnerships.
          </p>
        </Container>
      </section>

      <ServicesGrid />

      {/* Detailed service sections */}
      {serviceDetails.map((service, i) => (
        <Section key={service.id} tint={i % 2 === 0} id={service.id}>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {i % 2 === 0 ? (
                <>
                  <div>
                    <Eyebrow>{`0${i + 1} — ${service.subtitle.toUpperCase()}`}</Eyebrow>
                    <h2
                      style={{
                        fontFamily: "var(--sp-font-serif)",
                        fontSize: "clamp(26px, 3.5vw, 38px)",
                        fontWeight: 400,
                        letterSpacing: "var(--sp-track-h2)",
                        color: "var(--sp-navy-900)",
                        marginTop: 12,
                        lineHeight: 1.15,
                      }}
                    >
                      {service.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 16,
                        lineHeight: 1.7,
                        color: "var(--sp-gray-700)",
                        marginTop: 16,
                      }}
                    >
                      {service.desc}
                    </p>
                    <Link href="/contact" style={{ textDecoration: "none" }}>
                      <Button
                        variant="dark"
                        size="md"
                        icon={<ArrowRight size={15} strokeWidth={1.5} />}
                        style={{ marginTop: 24 }}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  <Card>
                    <div
                      className="flex items-center justify-center mb-5"
                      style={{
                        width: 52,
                        height: 52,
                        background: "var(--sp-gold-100)",
                        borderRadius: "var(--sp-radius)",
                        color: "var(--sp-gold-700)",
                      }}
                    >
                      <service.icon size={26} strokeWidth={1.5} />
                    </div>
                    <h4
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--sp-gray-500)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 14,
                      }}
                    >
                      Key Outcomes
                    </h4>
                    <div className="flex flex-col gap-3">
                      {service.outcomes.map((outcome) => (
                        <div key={outcome} className="flex items-start gap-3">
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "var(--sp-gold-500)",
                              flexShrink: 0,
                              marginTop: 7,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "var(--sp-font-sans)",
                              fontSize: 15,
                              color: "var(--sp-gray-700)",
                            }}
                          >
                            {outcome}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <Card>
                    <div
                      className="flex items-center justify-center mb-5"
                      style={{
                        width: 52,
                        height: 52,
                        background: "var(--sp-gold-100)",
                        borderRadius: "var(--sp-radius)",
                        color: "var(--sp-gold-700)",
                      }}
                    >
                      <service.icon size={26} strokeWidth={1.5} />
                    </div>
                    <h4
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--sp-gray-500)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 14,
                      }}
                    >
                      Key Outcomes
                    </h4>
                    <div className="flex flex-col gap-3">
                      {service.outcomes.map((outcome) => (
                        <div key={outcome} className="flex items-start gap-3">
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "var(--sp-gold-500)",
                              flexShrink: 0,
                              marginTop: 7,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "var(--sp-font-sans)",
                              fontSize: 15,
                              color: "var(--sp-gray-700)",
                            }}
                          >
                            {outcome}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <div>
                    <Eyebrow>{`0${i + 1} — ${service.subtitle.toUpperCase()}`}</Eyebrow>
                    <h2
                      style={{
                        fontFamily: "var(--sp-font-serif)",
                        fontSize: "clamp(26px, 3.5vw, 38px)",
                        fontWeight: 400,
                        letterSpacing: "var(--sp-track-h2)",
                        color: "var(--sp-navy-900)",
                        marginTop: 12,
                        lineHeight: 1.15,
                      }}
                    >
                      {service.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 16,
                        lineHeight: 1.7,
                        color: "var(--sp-gray-700)",
                        marginTop: 16,
                      }}
                    >
                      {service.desc}
                    </p>
                    <Link href="/contact" style={{ textDecoration: "none" }}>
                      <Button
                        variant="dark"
                        size="md"
                        icon={<ArrowRight size={15} strokeWidth={1.5} />}
                        style={{ marginTop: 24 }}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </Container>
        </Section>
      ))}

      <ProcessSection />
      <EngagementCTA />
    </>
  );
}
