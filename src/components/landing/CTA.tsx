import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">
            ¿Listo para tomar el control?
          </h2>
          <p className="mb-8 text-xl text-green-50">
            Comienza tu camino hacia un juego más responsable hoy mismo.
            Habla con nuestro asistente de IA de forma gratuita.
          </p>
          <Link href="/chat">
            <Button
              size="lg"
              variant="secondary"
              className="group text-lg"
            >
              Iniciar Conversación
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
