"use client";

import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from "web-vitals";

/**
 * Web Vitals Monitoring
 *
 * Tracks Core Web Vitals and reports them to analytics endpoint:
 * - LCP (Largest Contentful Paint): Loading performance
 * - INP (Interaction to Next Paint): Interactivity
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FCP (First Contentful Paint): Initial rendering
 * - TTFB (Time to First Byte): Server responsiveness
 */

function sendToAnalytics(metric: Metric) {
  // Only send in production
  if (process.env.NODE_ENV !== "production") {
    console.log("[Web Vitals]", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
    return;
  }

  // Send to analytics endpoint
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    timestamp: Date.now(),
    // Add user context
    url: window.location.href,
    userAgent: navigator.userAgent,
    connection: (navigator as any).connection?.effectiveType || "unknown",
  });

  // Use sendBeacon if available (better for page unload scenarios)
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/web-vitals", body);
  } else {
    // Fallback to fetch with keepalive
    fetch("/api/analytics/web-vitals", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
    }).catch((err) => {
      // Silent fail - don't block user experience
      console.error("[Web Vitals] Failed to send:", err);
    });
  }
}

/**
 * Initialize Web Vitals tracking
 * Call this in your root layout or main app component
 */
export function reportWebVitals() {
  // Core Web Vitals
  onLCP(sendToAnalytics); // Loading performance
  onINP(sendToAnalytics); // Interactivity
  onCLS(sendToAnalytics); // Visual stability

  // Additional metrics
  onFCP(sendToAnalytics); // First paint
  onTTFB(sendToAnalytics); // Server response time
}

/**
 * Get thresholds for each metric
 * Based on Google's Core Web Vitals thresholds
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: {
    good: 2500, // ms
    needsImprovement: 4000,
  },
  INP: {
    good: 200, // ms
    needsImprovement: 500,
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  FCP: {
    good: 1800, // ms
    needsImprovement: 3000,
  },
  TTFB: {
    good: 800, // ms
    needsImprovement: 1800,
  },
} as const;

/**
 * Helper function to get rating for a metric value
 */
export function getMetricRating(
  name: string,
  value: number
): "good" | "needs-improvement" | "poor" {
  const thresholds =
    WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];

  if (!thresholds) return "good";

  if (value <= thresholds.good) return "good";
  if (value <= thresholds.needsImprovement) return "needs-improvement";
  return "poor";
}
