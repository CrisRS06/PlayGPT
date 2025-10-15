'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function CTA() {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">
            {t.cta.title}
          </h2>
          <p className="mb-8 text-xl text-green-50">
            {t.cta.description}
          </p>
          <Link href="/chat">
            <Button
              size="lg"
              variant="secondary"
              className="group text-lg"
            >
              {t.cta.button}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
