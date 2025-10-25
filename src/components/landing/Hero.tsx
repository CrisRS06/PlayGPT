"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Sparkles, Brain, Target } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
      {/* Modern Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 gradient-mesh-strong opacity-40" />

      {/* Animated Background Blobs - Enhanced */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent/30 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-success/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Grid Background - Slightly more visible */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="mx-auto max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Badge - Enhanced Visibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/30 to-accent/30 border-primary/60 text-text-primary backdrop-blur-sm hover:from-primary/40 hover:to-accent/40 hover:border-primary/80 transition-all shadow-lg">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Educación con IA Avanzada
              </Badge>
            </motion.div>

            {/* Heading - Enhanced Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="text-text-primary drop-shadow-lg">
                  Aprende Juego
                </span>
                <br />
                <span className="text-gradient-aurora animate-glow">
                  Responsable con IA
                </span>
              </h1>

              <p className="text-xl text-text-body max-w-xl leading-relaxed">
                Plataforma educativa que utiliza inteligencia artificial y aprendizaje adaptativo
                para enseñarte probabilidad, toma de decisiones y gestión responsable.
              </p>
            </motion.div>

            {/* CTA Buttons - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="text-base font-semibold px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover hover:shadow-lg hover:shadow-primary/30 transition-all group relative overflow-hidden"
                asChild
              >
                <Link href="/chat">
                  <span className="relative z-10">Comenzar Aprendizaje</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-accent-hover opacity-0 group-hover:opacity-100 transition-opacity -z-0" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-base font-semibold px-8 py-6 border-border-strong text-text-primary hover:bg-surface-elevated hover:border-primary/50 transition-all"
                asChild
              >
                <Link href="#features">
                  Ver Características
                </Link>
              </Button>
            </motion.div>

            {/* Stats - Enhanced Visibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-border-strong"
            >
              <div>
                <p className="text-3xl font-bold text-gradient-aurora">
                  4+
                </p>
                <p className="text-sm text-text-secondary font-medium">Módulos</p>
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
                  100%
                </p>
                <p className="text-sm text-text-secondary font-medium">Adaptativo</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gradient">
                  IA
                </p>
                <p className="text-sm text-text-secondary font-medium">Powered</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Glassmorphic Card - Enhanced */}
            <div className="relative rounded-3xl border border-gray-200 glass-card p-8 shadow-2xl shadow-black/40 hover-lift">
              {/* Floating Elements - Enhanced */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl gradient-aurora flex items-center justify-center shadow-lg glow-primary"
              >
                <Brain className="w-12 h-12 text-text-primary drop-shadow-lg" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-accent to-success flex items-center justify-center shadow-lg glow-accent"
              >
                <Target className="w-12 h-12 text-text-primary drop-shadow-lg" />
              </motion.div>

              {/* Chat Preview - Enhanced */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/40 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="rounded-2xl rounded-tl-sm bg-surface-elevated p-4 border border-border-strong shadow-elevated">
                      <p className="text-sm text-text-body">
                        ¿Qué es el valor esperado y cómo se calcula?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-success/30 border border-accent/40 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-6 h-6 rounded-full gradient-aurora" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-primary/15 to-accent/15 p-4 border border-primary/30 shadow-elevated">
                      <p className="text-sm text-text-primary">
                        El valor esperado es un concepto fundamental en probabilidad.
                        Se calcula multiplicando cada resultado posible por su probabilidad...
                      </p>
                      <div className="mt-3 flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements - Enhanced */}
              <div className="absolute inset-0 rounded-3xl gradient-mesh opacity-30 -z-10" />
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
