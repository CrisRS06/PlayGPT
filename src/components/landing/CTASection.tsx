"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-12 text-center"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full filter blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full filter blur-3xl opacity-50" />

          {/* Content */}
          <div className="relative space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
              <Sparkles className="w-4 h-4 text-icon-primary" />
              <span className="text-sm font-medium text-text-primary">Comienza tu viaje de aprendizaje</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-text-primary">
                ¿Listo para aprender de forma inteligente?
              </h2>
              <p className="text-lg text-text-body max-w-2xl mx-auto">
                Únete ahora y experimenta una forma revolucionaria de aprender sobre
                juego responsable con tecnología de IA de última generación.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-base font-semibold px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group"
                asChild
              >
                <Link href="/chat">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-base font-semibold px-8 py-6 border-white/20 hover:bg-white/5"
                asChild
              >
                <Link href="#modules">
                  Explorar Módulos
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
