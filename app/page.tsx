export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            AI Study Planner
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
            Organize your subjects, assignments, deadlines, and study
            sessions with an intelligent study planning platform.
          </p>

          <div className="mt-8">
            <a
              href="/dashboard"
              className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}