'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, Languages } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChatHeader() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Back button */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.chatHeader.backButton}
            </Button>
          </Link>

          {/* Center: Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-500 text-white font-bold">
              P
            </div>
            <h1 className="text-lg font-bold text-gray-900">{siteConfig.name}</h1>
          </div>

          {/* Right: Language selector and Info button */}
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Languages className="h-4 w-4" />
              <span className="font-medium">{language.toUpperCase()}</span>
            </Button>

            {/* Info button */}
            <Button variant="ghost" size="sm" className="gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">{t.chatHeader.helpButton}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
