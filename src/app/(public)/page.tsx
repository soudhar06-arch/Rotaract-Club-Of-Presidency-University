import {
  HeroSection,
  CredibilityStrip,
  MissionVisionSection,
  HorizontalTimelineSection,
  ImpactStatsSection,
  FeaturedProjectSection,
  UpcomingEventsPreviewSection,
  GalleryPreviewSection,
  BoardPreviewSection,
  JoinCtaSection,
  TestimonialsSection,
  ContactSection,
} from "@/components/sections";
import { MOCK_TIMELINE } from "@/services/mock-data";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <CredibilityStrip />
      <MissionVisionSection />
      <HorizontalTimelineSection milestones={MOCK_TIMELINE} />
      <ImpactStatsSection />
      <FeaturedProjectSection />
      <UpcomingEventsPreviewSection />
      <GalleryPreviewSection />
      <BoardPreviewSection />
      <JoinCtaSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
