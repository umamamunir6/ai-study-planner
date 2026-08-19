"use client";

import { useEffect } from "react";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="app-error-page">
      <div className="app-error-card">
        <div className="app-error-icon">⚠️</div>

        <h1>Something went wrong</h1>

        <p>
          We couldn't load this page correctly.
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="retry-button"
        >
          ↻ Try again
        </button>
      </div>
    </main>
  );
}
