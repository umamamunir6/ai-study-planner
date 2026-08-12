const HealthPage = async () => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  const data = await response.json();

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Health Check
      </h1>

      <div className="rounded-lg border p-6">
        <p className="mb-4 font-semibold text-green-600">
          ✓ API is working
        </p>

        <p>
          <strong>Fetched Data:</strong>
        </p>

        <p className="mt-2">
          {data.title}
        </p>
      </div>
    </main>
  );
};

export default HealthPage;