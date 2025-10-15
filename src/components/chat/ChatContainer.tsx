'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatContainerProps {
  children: ReactNode;
}

export default function ChatContainer({ children }: ChatContainerProps) {
  const { t } = useLanguage();
  return (
    <div className="flex h-full flex-col">
      {/* Welcome Message - Optional */}
      <div className="border-b bg-gradient-to-r from-green-50 to-blue-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-center text-sm text-gray-600">
            <span className="font-semibold">{t.chatContainer.welcome}.</span>{' '}
            {t.chatContainer.subtitle}
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Footer Disclaimer */}
      <div className="border-t bg-gray-50 px-4 py-2">
        <p className="text-center text-xs text-gray-500">
          {t.footer.disclaimer}
        </p>
      </div>
    </div>
  );
}
