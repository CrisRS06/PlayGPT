"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Menu, X } from "lucide-react"
import { useState } from "react"
import { UserMenu } from "@/components/auth/UserMenu"

interface NavigationClientProps {
  user: {
    email?: string
    user_metadata?: {
      full_name?: string
    }
  } | null
}

export function NavigationClient({ user }: NavigationClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/50"
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <Sparkles className="relative h-8 w-8 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              PlayGPT EDU
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Características
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="#modules"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Módulos
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/chat">Ir al Chat</Link>
                </Button>
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" className="relative overflow-hidden group" asChild>
                  <Link href="/auth/signup">
                    <span className="relative z-10">Comenzar Ahora</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 pb-2 flex flex-col gap-4"
          >
            <Link
              href="#features"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Características
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link
              href="#modules"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Módulos
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              {user ? (
                <>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/chat">Ir al Chat</Link>
                  </Button>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-300">{user.email}</span>
                    <UserMenu user={user} />
                  </div>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/auth/login">Iniciar Sesión</Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/auth/signup">Comenzar Ahora</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
