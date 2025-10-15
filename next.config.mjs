/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Optimizaciones de imagen
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Configuración webpack para fix @botpress/webchat asset/inline error
  webpack: (config) => {
    // Fix para error de webpack asset modules con @botpress/webchat
    // El problema es que Next.js usa module.generator.asset con 'filename'
    // pero asset/inline solo acepta 'dataUrl' en generator
    if (config.module.generator?.asset?.filename) {
      // Mover la configuración de 'asset' a 'asset/resource'
      if (!config.module.generator['asset/resource']) {
        config.module.generator['asset/resource'] = config.module.generator.asset;
      }
      if (!config.module.generator['asset/source']) {
        config.module.generator['asset/source'] = config.module.generator.asset;
      }
      // Eliminar la configuración genérica 'asset' para que asset/inline funcione
      delete config.module.generator.asset;
    }

    return config;
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
