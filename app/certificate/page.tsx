export default function CertificatePage() {
  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">
        Uzbekistan National Certificate
      </h1>

      <p className="text-gray-300 mb-6 max-w-2xl">
        Prepare for the Uzbekistan National Certificate exam with structured practice and tests.
      </p>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 max-w-xl">
        <p className="text-lg">
          Example: Simplify (x² - 9) / (x - 3)
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