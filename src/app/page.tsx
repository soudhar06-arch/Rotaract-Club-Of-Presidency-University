import { Navbar } from "@/components/navigation";
import { Footer } from "@/components/layout";
import { AIAssistant, CinematicBackground } from "@/components/shared";
import {
  HeroSection,
  CredibilityStrip,
  MissionVisionSection,
  ImpactStatsSection,
  FeaturedProjectSection,
  UpcomingEventsPreviewSection,
  GalleryPreviewSection,
  AwardsPreviewSection,
  BoardPreviewSection,
  TestimonialsSection,
  JoinCtaSection,
  SponsorsSection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#050505] text-white">
      <CinematicBackground />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CredibilityStrip />
        <MissionVisionSection />
        <ImpactStatsSection />
        <FeaturedProjectSection />
        <UpcomingEventsPreviewSection />
        <GalleryPreviewSection />
        <AwardsPreviewSection />
        <BoardPreviewSection />
        <TestimonialsSection />
        <JoinCtaSection />
        <SponsorsSection />
      </main>
      <AIAssistant />
      <Footer />
    </div>
  );
}
