'use client';

import { ReactNode } from 'react';

interface ChatContainerProps {
  children: ReactNode;
}

export default function ChatContainer({ children }: ChatContainerProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Welcome Message - Optional */}
      <div className="border-b bg-gradient-to-r from-green-50 to-blue-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-center text-sm text-gray-600">
            <span className="font-semibold">Bienvenido a PlayGPT.</span> Estoy aquí
            para ayudarte con información sobre juego responsable. ¿En qué puedo
            asistirte hoy?
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Footer Disclaimer */}
      <div className="border-t bg-gray-50 px-4 py-2">
        <p className="text-center text-xs text-gray-500">
          PlayGPT es una herramienta educativa y no reemplaza ayuda profesional.
        </p>
      </div>
    </div>
  );
}
