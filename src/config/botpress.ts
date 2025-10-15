export const botpressConfig = {
  clientId: process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID || '',
  hostUrl: process.env.NEXT_PUBLIC_BOTPRESS_HOST_URL || 'https://cdn.botpress.cloud/webchat/v2',
  messagingUrl: 'https://api.botpress.cloud',

  // Configuración del tema
  theme: {
    primaryColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
  },

  // Configuración del bot
  botName: 'PlayGPT',
  botDescription: 'Asistente de Juego Responsable',
  botAvatar: '/bot-avatar.png',
};

export function getBotpressConfig() {
  if (!botpressConfig.clientId) {
    console.warn('NEXT_PUBLIC_BOTPRESS_CLIENT_ID is not defined in environment variables');
  }
  return botpressConfig;
}
