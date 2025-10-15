import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 py-20 lg:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-green-100 to-blue-100 opacity-20 blur-3xl" />
        <div className="absolute right-0 top-[20%] h-[300px] w-[300px] rounded-full bg-gradient-to-br from-blue-100 to-green-100 opacity-20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
            <MessageCircle className="mr-2 h-4 w-4" />
            Asistente IA de Juego Responsable
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 lg:text-7xl">
            Juega{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Responsable
            </span>
            <br />
            con PlayGPT
          </h1>

          {/* Description */}
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600 lg:text-2xl">
            Tu asistente personal impulsado por IA para aprender sobre juego
            responsable, autoexclusión y prevención de ludopatía.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/chat">
              <Button
                size="lg"
                className="group w-full text-lg sm:w-auto"
              >
                Habla con el Bot
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg sm:w-auto"
            >
              Ver Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Disponible 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>100% Confidencial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Sin registro requerido</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
