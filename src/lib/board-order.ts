// Role hierarchy transcribed from the authoritative root Hierarchy.txt.
export const BOARD_ROLES = [
  "President", "Vice President", "Secretary", "Joint Secretary", "Sergeant At Arms", "Treasurer",
  "Club Service Director", "Co-Club Service Director", "Community Service Director",
  "Co-Community Service Director", "PD Director", "PR Director", "International Service Director",
  "Chief Editor", "Marketing Head", "Membership Development and Retention Director",
  "Sports and Socio-Culture Director", "Women and Children Welfare Director",
] as const;

const normalize = (role: string) => role.toLowerCase().replace(/[^a-z0-9]/g, "");
const aliases: Record<string, string> = {
  professionaldevelopment: "PD Director", professionaldevelopmentdirector: "PD Director",
  publicrelations: "PR Director", publicrelationsdirector: "PR Director",
  clubservice: "Club Service Director", communityservice: "Community Service Director",
  internationalservice: "International Service Director", sergeantatarms: "Sergeant At Arms",
};
export function boardRoleRank(role: string) {
  const key = normalize(role);
  const rank = BOARD_ROLES.findIndex((r) => normalize(r) === normalize(aliases[key] || role));
  return rank < 0 ? BOARD_ROLES.length : rank;
}

export function sortBoard<T extends { role: string; displayOrder?: number; name: string }>(members: T[]): T[] {
  return [...members].sort((a, b) => boardRoleRank(a.role) - boardRoleRank(b.role)
    || (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.name.localeCompare(b.name));
}
