"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Fatal Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-900 p-6 font-sans text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center shadow-2xl">
          <h1 className="mb-2 text-2xl font-bold text-red-400">
            Critical Application Error
          </h1>
          <p className="mb-6 text-sm text-slate-300">
            A critical error interrupted system execution. Please refresh or
            attempt to reset.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
