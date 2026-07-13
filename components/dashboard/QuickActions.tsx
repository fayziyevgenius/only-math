import Link from "next/link";

export default function QuickActions() {
  const cards = [
    {
      emoji: "📝",
      title: "Start Solving",
      href: "/certificate",
    },
    {
      emoji: "🤔",
      title: "Today's Problem",
      href: "/daily",
    },
    {
      emoji: "🏆",
      title: "Leaderboard",
      href: "/leaderboard",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="
            rounded-3xl
            bg-gradient-to-br
            from-slate-900
            to-slate-800
            border
            border-zinc-700
            p-10
            hover:scale-105
            transition
            duration-300
            text-center
          "
        >
          <div className="text-6xl">{card.emoji}</div>

          <h2 className="text-2xl font-bold mt-6">
            {card.title}
          </h2>
        </Link>
      ))}
    </div>
  );
}