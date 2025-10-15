export const siteConfig = {
  name: 'PlayGPT',
  description: 'Tu asistente personal impulsado por IA para aprender sobre juego responsable, autoexclusión y prevención de ludopatía.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
  },
  creator: 'Christian Ramirez',
};

export type SiteConfig = typeof siteConfig;
