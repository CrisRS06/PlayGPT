'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import es from '@/translations/es.json';
import en from '@/translations/en.json';

type Language = 'es' | 'en';

// Type for translations
type Translations = typeof es;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations = {
  es,
  en,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Inicializar con español por defecto
  const [language, setLanguageState] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  // Cargar idioma desde localStorage en el cliente
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Función para cambiar idioma y persistir en localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  // Evitar hidratación inconsistente mostrando el idioma por defecto hasta que monte
  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{
          language: 'es',
          setLanguage,
          t: translations.es,
        }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
