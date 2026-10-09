"use client";

import { Suspense } from "react";
import HomePage from "./HomePage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center text-gray-500 bg-gray-50">
          Loading…
        </div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
