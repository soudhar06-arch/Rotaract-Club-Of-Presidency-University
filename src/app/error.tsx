"use client";

import { useEffect } from "react";
import ErrorPage from "@/components/ui/error-3";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Error Boundary caught error:", error);
  }, [error]);

  return (
    <ErrorPage
      code="500"
      title="System Execution Exception"
      description={error.message || "An unexpected runtime exception occurred."}
      reset={reset}
    />
  );
}
