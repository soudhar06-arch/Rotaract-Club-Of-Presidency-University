import "server-only";
import { CMSStore, type MediaItem } from "./cms-store";
import { getEventFeed } from "./event-service";

export async function getPublicGallery(): Promise<MediaItem[]> {
  const [media, feed] = await Promise.allSettled([
    CMSStore.isConfigured() ? CMSStore.getGallery() : Promise.resolve([]),
    getEventFeed(),
  ]);
  const registered = media.status === "fulfilled"
    ? media.value.filter(item => ["Gallery", "Event", "Project"].includes(item.category)) : [];
  const photos: MediaItem[] = feed.status === "fulfilled" ? feed.value.events.flatMap(event =>
    event.images.map((url, index) => ({ id: `${event.id}-${index}`, name: `${event.title} — photo ${index + 1}`,
      url, category: "Event", uploadedAt: event.date }))) : [];
  if (media.status === "rejected" && !photos.length) throw new Error("Gallery is temporarily unavailable.");
  return [...new Map([...registered, ...photos].map(item => [item.url, item])).values()];
}
