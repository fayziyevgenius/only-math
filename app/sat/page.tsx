export default function SATPage() {
  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">SAT Preparation</h1>

      <p className="text-gray-300 mb-6 max-w-2xl">
        Practice SAT-level math problems, improve your speed, and track your progress.
      </p>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 max-w-xl">
        <p className="text-lg">
          Example: If 2x + 5 = 15, what is x?
        </p>

        <input 
          className="mt-4 p-2 bg-black border border-gray-700 rounded w-full"
          placeholder="Your answer..."
        />

        <button className="mt-4 bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition">
          Submit
        </button>
      </div>
    </div>
  );
}