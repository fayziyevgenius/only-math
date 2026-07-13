export default function Hero() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md p-8">
      <h1 className="text-5xl font-bold text-white">
        {greeting}, Fayzibek 👋
      </h1>

      <p className="mt-4 text-xl text-zinc-400">
        Ready to become today's Math Genius?
      </p>
    </div>
  );
}