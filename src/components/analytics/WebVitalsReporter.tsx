"use client";

import { useEffect } from "react";
import { reportWebVitals } from "@/lib/web-vitals";

/**
 * Web Vitals Reporter Component
 *
 * Client component that initializes Web Vitals tracking on mount
 * Should be included once in the root layout
 */
export function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals tracking
    reportWebVitals();
  }, []);

  // This component doesn't render anything
  return null;
}
