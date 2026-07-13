type Props = {
  name: string;
};

export default function WelcomeBanner({ name }: Props) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="rounded-3xl border border-green-500/30 bg-zinc-900 p-8">
      <h1 className="text-4xl font-bold text-white">
        {greeting}, {name} 👋
      </h1>

      <p className="text-gray-400 mt-3 text-lg">
        Ready to become today's Math Genius?
      </p>
    </div>
  );
}