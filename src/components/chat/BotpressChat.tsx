'use client';

import { Webchat } from '@botpress/webchat';
import type { Configuration } from '@botpress/webchat';
import { getBotpressConfig } from '@/config/botpress';

export default function BotpressChat() {
  const config = getBotpressConfig();

  // Configuración del webchat
  const configuration: Configuration = {
    botName: config.botName,
    botDescription: config.botDescription,
    color: config.theme.primaryColor,
    // Configuración adicional
    website: {
      title: 'Sitio Web',
      link: 'https://playgpt.ai',
    },
    email: {
      title: 'Contacto',
      link: 'mailto:soporte@playgpt.ai',
    },
    phone: {
      title: 'Teléfono',
      link: 'tel:+1234567890',
    },
  };

  return (
    <div className="h-full w-full">
      {/* Componente Webchat con clientId y configuration */}
      <Webchat clientId={config.clientId} configuration={configuration} />
    </div>
  );
}
