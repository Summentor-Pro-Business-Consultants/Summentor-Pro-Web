import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import StatsBar from "@/components/sections/StatsBar";
import CredibilityBand from "@/components/sections/CredibilityBand";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProcessSection from "@/components/sections/ProcessSection";
import EventsSection from "@/components/sections/EventsSection";
import EngagementCTA from "@/components/sections/EngagementCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <StatsBar />
      <CredibilityBand />
      <ServicesGrid />
      <EventsSection />
      <ProcessSection />
      <EngagementCTA />
    </>
  );
}
