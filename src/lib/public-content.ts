import "server-only";
import { getCMSClient } from "./cms-store";
const sources = {
  awards: { table: "awards", flag: "is_published" },
  partners: { table: "partners", flag: "is_active" },
  testimonials: { table: "testimonials", flag: "is_published" },
  timeline: { table: "timeline_items", flag: "is_active" },
  avenues: { table: "avenues", flag: null },
} as const;
export async function readPublicCollection(module: keyof typeof sources) {
  const source = sources[module];
  let query = getCMSClient().from(source.table).select("*");
  if (source.flag) query = query.eq(source.flag, true);
  if (["partners", "timeline", "avenues"].includes(module)) query = query.order("display_order");
  const { data, error } = await query;
  if (error) throw new Error(`Could not load ${module}: ${error.message}`);
  return data || [];
}
