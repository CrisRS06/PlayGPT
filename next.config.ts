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
  },

  // ===============================================
  // PRODUCTION OPTIMIZATIONS
  // ===============================================

  // Compress responses
  compress: true,

  // Generate standalone build for Docker/Serverless
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,

  // ===============================================
  // TYPESCRIPT & LINTING
  // ===============================================

  typescript: {
    // Dangerously allow production builds even if types have errors
    // Set to false in production for strict checking
    ignoreBuildErrors: false,
  },

  eslint: {
    // Warn during builds but don't fail
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
