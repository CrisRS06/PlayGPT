import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: Web Vitals Analytics
 *
 * Receives Core Web Vitals metrics from client
 * Currently logs to console - can be extended to store in database or analytics service
 */

interface WebVitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connection: string;
}

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json();

    // Validate metric data
    if (!metric.name || typeof metric.value !== "number") {
      return NextResponse.json(
        { error: "Invalid metric data" },
        { status: 400 }
      );
    }

    // Log metric (in production, you would send to analytics service)
    console.log("[Web Vitals Analytics]", {
      metric: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      url: metric.url,
      connection: metric.connection,
      timestamp: new Date(metric.timestamp).toISOString(),
    });

    // TODO: Send to analytics service (e.g., Google Analytics, Vercel Analytics, PostHog)
    // Example integrations:
    //
    // 1. Google Analytics 4:
    // gtag('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   metric_id: metric.id,
    //   metric_value: metric.value,
    //   metric_delta: metric.delta,
    // });
    //
    // 2. PostHog:
    // posthog.capture('web_vital', {
    //   metric_name: metric.name,
    //   metric_value: metric.value,
    //   metric_rating: metric.rating,
    // });
    //
    // 3. Store in Supabase:
    // await supabase.from('web_vitals').insert({
    //   metric_name: metric.name,
    //   metric_value: metric.value,
    //   metric_rating: metric.rating,
    //   page_url: metric.url,
    //   user_agent: metric.userAgent,
    //   created_at: new Date(metric.timestamp).toISOString(),
    // });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Web Vitals Analytics] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Preflight request handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
