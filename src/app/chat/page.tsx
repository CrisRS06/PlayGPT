'use client';

import dynamic from 'next/dynamic';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatContainer from '@/components/chat/ChatContainer';

// Cargar BotpressChat solo en el cliente (sin SSR)
const BotpressChat = dynamic(() => import('@/components/chat/BotpressChat'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600 mx-auto"></div>
        <p className="text-gray-600">Cargando chat...</p>
      </div>
    </div>
  ),
});

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <ChatHeader />
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full p-4 lg:p-8">
          <div className="mx-auto h-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <ChatContainer>
              <BotpressChat />
            </ChatContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
