export default function OlympiadPage() {
  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">Olympiad Training</h1>

      <p className="text-gray-300 mb-6 max-w-2xl">
        Solve high-level mathematical problems and develop deep problem-solving skills.
      </p>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 max-w-xl">
        <p className="text-lg">
          Prove that the sum of the angles in any triangle is 180°.
        </p>

        <textarea 
          className="mt-4 p-2 bg-black border border-gray-700 rounded w-full h-32"
          placeholder="Write your solution..."
        />

        <button className="mt-4 bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition">
          Submit
        </button>
      </div>
    </div>
  );
}