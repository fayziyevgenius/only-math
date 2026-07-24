export function getTitle(gp: number) {
  if (gp >= 3000) return "👑 Math Genius";
  if (gp >= 1500) return "💎 Diamond";
  if (gp >= 700) return "🥇 Gold";
  if (gp >= 300) return "🥈 Silver";
  if (gp >= 100) return "🥉 Bronze";

  return "🌱 Beginner";
}