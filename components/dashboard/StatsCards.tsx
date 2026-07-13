type Props = {
  geniusPoints: number;
  streak: number;
  title: string;
};

export default function StatsCards({
  geniusPoints,
  streak,
  title,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
        <p className="text-gray-400">⭐ Genius Points</p>

        <h2 className="text-4xl font-bold mt-2">
          {geniusPoints}
        </h2>
      </div>

      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
        <p className="text-gray-400">🔥 Streak</p>

        <h2 className="text-4xl font-bold mt-2">
          {streak} Days
        </h2>
      </div>

      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
        <p className="text-gray-400">👑 Title</p>

        <h2 className="text-3xl font-bold mt-2">
          {title}
        </h2>
      </div>

    </div>
  );
}