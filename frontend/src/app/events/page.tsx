import type { Metadata } from "next";
import Link from "next/link";
import EventsSection from "@/components/sections/EventsSection";
import EngagementCTA from "@/components/sections/EngagementCTA";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Events | Summentor Pro",
  description:
    "Discover Summentor Pro's curated B2B events, founder summits, and government roundtables across India.",
};

const pastEvents = [
  {
    year: "2024",
    title: "MSME Innovation Forum",
    city: "Bengaluru",
    attendees: "200+",
    desc: "A landmark gathering of MSME founders with key government officials and industry enablers.",
  },
  {
    year: "2024",
    title: "Startup Growth Summit",
    city: "Mumbai",
    attendees: "350+",
    desc: "India's fastest-growing startups met with 50+ investors in structured matchmaking sessions.",
  },
  {
    year: "2023",
    title: "B2G Connect India",
    city: "Delhi NCR",
    attendees: "150+",
    desc: "A policy-level dialogue between MSME businesses and government ministry representatives.",
  },
];

const eventTypes = [
  {
    icon: Users,
    title: "Founder Summits",
    desc: "Invite-only gatherings designed for high-quality connections between founders, investors, and operators.",
  },
  {
    icon: Calendar,
    title: "Industry Conferences",
    desc: "Sector-specific events that bring together key stakeholders to shape policy and drive ecosystem growth.",
  },
  {
    icon: MapPin,
    title: "Networking Meetups",
    desc: "Monthly curated meetups across Bangalore, Mumbai, and Delhi NCR for ongoing relationship-building.",
  },
];

export default function EventsPage() {
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
          src="/icons/skyline.svg"
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
            EVENTS & SUMMITS
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
            Where business relationships are built.
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
            Summentor Pro curates high-impact events across India — from intimate founder
            roundtables to large-scale industry summits — each designed to create real, lasting
            business connections.
          </p>
        </Container>
      </section>

      {/* Event formats */}
      <Section tint py={80}>
        <Container>
          <div className="text-center mb-12">
            <Eyebrow className="justify-center">EVENT FORMATS</Eyebrow>
            <h2
              style={{
                fontFamily: "var(--sp-font-serif)",
                fontSize: "clamp(26px, 3.5vw, 36px)",
                fontWeight: 400,
                letterSpacing: "var(--sp-track-h2)",
                color: "var(--sp-navy-900)",
                marginTop: 12,
              }}
            >
              Curated for every stage of your journey.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventTypes.map((type) => (
              <Card key={type.title} className="text-center">
                <div
                  className="flex items-center justify-center mx-auto mb-4"
                  style={{
                    width: 52,
                    height: 52,
                    background: "var(--sp-gold-100)",
                    borderRadius: "var(--sp-radius)",
                    color: "var(--sp-gold-700)",
                  }}
                >
                  <type.icon size={24} strokeWidth={1.5} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--sp-font-serif)",
                    fontSize: 22,
                    fontWeight: 500,
                    color: "var(--sp-navy-900)",
                  }}
                >
                  {type.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "var(--sp-gray-600)",
                    marginTop: 10,
                  }}
                >
                  {type.desc}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <EventsSection />

      {/* Past events */}
      <Section tint py={80}>
        <Container>
          <div className="mb-12">
            <Eyebrow>PAST EVENTS</Eyebrow>
            <h2
              style={{
                fontFamily: "var(--sp-font-serif)",
                fontSize: "clamp(26px, 3.5vw, 36px)",
                fontWeight: 400,
                letterSpacing: "var(--sp-track-h2)",
                color: "var(--sp-navy-900)",
                marginTop: 12,
              }}
            >
              A track record of impact.
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {pastEvents.map((event) => (
              <div
                key={event.title}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-6 rounded"
                style={{
                  background: "#fff",
                  border: "1px solid var(--sp-gray-200)",
                  borderRadius: "var(--sp-radius-md)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--sp-font-mono)",
                    fontSize: 13,
                    color: "var(--sp-gold-500)",
                    fontWeight: 500,
                    flexShrink: 0,
                    minWidth: 40,
                  }}
                >
                  {event.year}
                </div>
                <div className="flex-1">
                  <h4
                    style={{
                      fontFamily: "var(--sp-font-serif)",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "var(--sp-navy-900)",
                    }}
                  >
                    {event.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 14,
                      color: "var(--sp-gray-600)",
                      marginTop: 4,
                    }}
                  >
                    {event.desc}
                  </p>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} strokeWidth={1.5} style={{ color: "var(--sp-gold-500)" }} />
                    <span
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 13,
                        color: "var(--sp-gray-600)",
                      }}
                    >
                      {event.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} strokeWidth={1.5} style={{ color: "var(--sp-gold-500)" }} />
                    <span
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 13,
                        color: "var(--sp-gray-600)",
                      }}
                    >
                      {event.attendees}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA to request invitation */}
      <Section dark py={80}>
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow
              gold={false}
              style={{ color: "var(--sp-gold-500)" }}
              className="justify-center"
            >
              ATTEND AN EVENT
            </Eyebrow>
            <h2
              style={{
                fontFamily: "var(--sp-font-serif)",
                fontSize: "clamp(26px, 3.5vw, 38px)",
                fontWeight: 400,
                letterSpacing: "var(--sp-track-h2)",
                color: "#fff",
                marginTop: 12,
                lineHeight: 1.15,
              }}
            >
              Ready to join the conversation?
            </h2>
            <p
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 17,
                lineHeight: 1.65,
                color: "var(--sp-navy-300)",
                marginTop: 16,
              }}
            >
              Our events are curated for quality connections. Request an invitation and our team
              will get in touch with details about upcoming gatherings near you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={16} strokeWidth={1.5} />}
                >
                  Request an Invitation
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <EngagementCTA />
    </>
  );
}
