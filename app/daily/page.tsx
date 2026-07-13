export default function DailyPage() {
  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">Daily Problem</h1>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 max-w-xl">
        <p className="text-lg">
          Find all real numbers x such that x² - 5x + 6 = 0
        </p>

        <input 
          className="mt-4 p-2 bg-black border border-gray-700 rounded w-full"
          placeholder="Your answer..."
        />

        <button className="mt-4 bg-green-500 px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </div>
  );
}