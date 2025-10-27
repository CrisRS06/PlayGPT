import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ===============================================
  // WEBPACK CONFIGURATION
  // ===============================================

  webpack: (config, { isServer }) => {
    // Vendor splitting - separate chunks for better caching
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // React and Next.js framework
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: "framework",
              priority: 40,
              enforce: true,
            },
            // Animation libraries
            animation: {
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              name: "animation",
              priority: 35,
              enforce: true,
            },
            // Radix UI components
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: "radix",
              priority: 30,
              enforce: true,
            },
            // Chart libraries
            charts: {
              test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
              name: "charts",
              priority: 25,
              enforce: true,
            },
            // Icons
            icons: {
              test: /[\\/]node_modules[\\/](lucide-react|@radix-ui\/react-icons)[\\/]/,
              name: "icons",
              priority: 20,
              enforce: true,
            },
            // Supabase client
            supabase: {
              test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
              name: "supabase",
              priority: 15,
              enforce: true,
            },
            // Other vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendor",
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // ===============================================
  // HEADERS & CACHING
  // ===============================================

  async headers() {
    return [
      {
        // Apply security and caching headers to all routes
        source: "/:path*",
        headers: [
          // Security Headers
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache images
        source: "/:all*.(svg|jpg|jpeg|png|gif|ico|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // ===============================================
  // IMAGES OPTIMIZATION
  // ===============================================

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // ===============================================
  // COMPILER OPTIONS
  // ===============================================

  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // ===============================================
  // EXPERIMENTAL FEATURES
  // ===============================================

  experimental: {
    // Optimize CSS loading
    optimizeCss: true,

    // Server Actions optimization
    serverActions: {
      bodySizeLimit: "2mb",
    },

    // Package imports optimization - Reduces bundle size by tree-shaking barrel exports
    optimizePackageImports: [
      // ALTA PRIORIDAD - Paquetes grandes con barrel exports
      "recharts",                       // 54.3 KB - Charts en dashboard

      // Radix UI components (14 paquetes en el proyecto)
      "@radix-ui/react-accordion",
      "@radix-ui/react-avatar",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",

      // MEDIA PRIORIDAD
      "react-circular-progressbar",
      "@xyflow/react",
      "canvas-confetti",

      // State management
      "zustand",

      // NOTA: framer-motion, lucide-react y date-fns ya están optimizados por defecto en Next.js 16
      // y no necesitan estar en esta lista
    ],
  },

  // ===============================================
  // PRODUCTION OPTIMIZATIONS
  // ===============================================

  // Compress responses
  compress: true,

  // Generate standalone build for Docker/Serverless
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,

  // ===============================================
  // TYPESCRIPT
  // ===============================================

  typescript: {
    // Dangerously allow production builds even if types have errors
    // Set to false in production for strict checking
    ignoreBuildErrors: false,
  },

  // NOTE: ESLint configuration moved to eslint.config.mjs (flat config)
  // The 'eslint' option in next.config.ts is deprecated in Next.js 16
};

export default nextConfig;
