import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // Enable safe area insets for iOS
};

export const metadata: Metadata = {
  title: {
    default: "PlayGPT EDU - Educación en Juego Responsable con IA",
    template: "%s | PlayGPT EDU",
  },
  description:
    "Plataforma educativa avanzada que utiliza IA y aprendizaje adaptativo para enseñar conceptos de juego responsable, probabilidad y toma de decisiones informadas.",
  keywords: [
    "juego responsable",
    "educación",
    "IA",
    "probabilidad",
    "bankroll management",
    "gambling education",
    "aprendizaje adaptativo",
    "inteligencia artificial",
    "toma de decisiones",
  ],
  authors: [{ name: "PlayGPT EDU Team" }],
  creator: "PlayGPT EDU",
  publisher: "PlayGPT EDU",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "PlayGPT EDU",
    title: "PlayGPT EDU - Educación en Juego Responsable con IA",
    description:
      "Aprende sobre juego responsable con nuestra plataforma de educación adaptativa basada en IA. Quizzes personalizados, seguimiento de progreso y conceptos avanzados de probabilidad.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PlayGPT EDU - Plataforma de educación en juego responsable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayGPT EDU - Educación en Juego Responsable",
    description:
      "Aprende probabilidad y juego responsable con IA. Plataforma educativa adaptativa con quizzes personalizados.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification here when available
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebVitalsReporter />
        <Toaster position="top-right" richColors closeButton />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
