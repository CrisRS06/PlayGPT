import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              {siteConfig.name}
            </h3>
            <p className="mb-4 max-w-md text-sm text-gray-600">
              Asistente de IA dedicado a promover el juego responsable,
              la prevención de ludopatía y el bienestar de los jugadores.
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/chat"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  Chat con el Bot
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  Guías Educativas
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  Autoexclusión
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  Ayuda Profesional
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-xs text-gray-500">
            <strong>Aviso importante:</strong> PlayGPT es una herramienta educativa
            de IA y no reemplaza la ayuda profesional. Si necesitas apoyo urgente,
            contacta a un profesional de la salud mental o llama a una línea de ayuda
            especializada en ludopatía.
          </p>
        </div>
      </div>
    </footer>
  );
}
