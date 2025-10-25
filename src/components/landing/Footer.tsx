"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  product: [
    { label: "Características", href: "#features" },
    { label: "Módulos", href: "#modules" },
    { label: "Cómo funciona", href: "#how-it-works" },
  ],
  company: [
    { label: "Sobre nosotros", href: "/about" },
    { label: "Contacto", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Privacidad", href: "/privacy" },
    { label: "Términos", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-lg opacity-50" />
                <Sparkles className="relative h-8 w-8 text-primary" />
              </div>
              <span className="text-xl font-bold text-text-primary">
                PlayGPT EDU
              </span>
            </Link>
            <p className="text-sm text-text-secondary">
              Educación en juego responsable impulsada por IA avanzada.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Producto</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Compañía</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-secondary">
            © 2025 PlayGPT EDU. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Términos
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
