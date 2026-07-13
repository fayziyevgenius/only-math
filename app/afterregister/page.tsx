import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCards from "@/components/dashboard/StatsCards";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      <WelcomeBanner name="Fayzibek" />

      <StatsCards
        geniusPoints={0}
        streak={0}
        title="🌱 Beginner"
      />

    </div>
  );
}