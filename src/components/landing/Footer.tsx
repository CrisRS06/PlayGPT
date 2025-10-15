'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
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
              {t.footer.description}
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {siteConfig.name}. {t.footer.allRightsReserved}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">{t.footer.resources}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  {t.footer.blog}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  {t.footer.guides}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  {t.footer.support}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">{t.footer.legal}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 transition-colors hover:text-green-600"
                >
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-xs text-gray-500">
            {t.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
