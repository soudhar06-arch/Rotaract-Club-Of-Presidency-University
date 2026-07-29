import { Navbar } from "@/components/navigation";
import { Footer } from "@/components/layout";
import { AIAssistant } from "@/components/shared";
import {
  HeroSection,
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
    <div className="relative flex min-h-screen flex-col bg-[color:var(--color-bg-primary)]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
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
