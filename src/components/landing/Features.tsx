"use client"

import { motion } from "framer-motion"
import { Brain, MessageSquare, TrendingUp, Shield, Zap, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "IA Avanzada",
    description: "Utiliza modelos de lenguaje de última generación para proporcionar explicaciones personalizadas y adaptativas.",
    gradient: "from-primary/30 to-accent/30",
    iconColor: "text-primary",
    glowColor: "glow-primary",
  },
  {
    icon: MessageSquare,
    title: "Chat Interactivo",
    description: "Aprende mediante conversaciones naturales. Pregunta lo que quieras y recibe respuestas contextualizadas.",
    gradient: "from-accent/30 to-info/30",
    iconColor: "text-accent",
    glowColor: "glow-accent",
  },
  {
    icon: TrendingUp,
    title: "Aprendizaje Adaptativo",
    description: "El sistema se adapta a tu nivel y ritmo de aprendizaje para maximizar tu progreso.",
    gradient: "from-success/30 to-primary/30",
    iconColor: "text-success",
    glowColor: "glow-success",
  },
  {
    icon: Shield,
    title: "Juego Responsable",
    description: "Enfoque científico en probabilidad, valor esperado y gestión de riesgos basado en evidencia.",
    gradient: "from-warning/30 to-accent/30",
    iconColor: "text-warning",
    glowColor: "glow-primary",
  },
  {
    icon: Zap,
    title: "Resultados Rápidos",
    description: "Sistema RAG que proporciona respuestas precisas basadas en nuestra base de conocimiento curada.",
    gradient: "from-accent/30 to-primary/30",
    iconColor: "text-accent",
    glowColor: "glow-accent",
  },
  {
    icon: Target,
    title: "Evaluación Continua",
    description: "Quizzes dinámicos generados por IA para evaluar tu comprensión y reforzar conceptos clave.",
    gradient: "from-primary/30 to-success/30",
    iconColor: "text-primary",
    glowColor: "glow-primary",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Features() {
  return (
    <section id="features" className="relative py-24 px-6 overflow-hidden">
      {/* Background Effects - Enhanced */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success/15 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-text-primary">
            Características Principales
          </h2>
          <p className="text-lg text-text-body">
            Tecnología de vanguardia para una experiencia de aprendizaje única y efectiva
          </p>
        </motion.div>

        {/* Features Grid - Enhanced */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="group relative h-full overflow-hidden border-border-strong glass-card hover:border-primary/30 transition-all duration-300 hover-lift hover:shadow-elevated">
                <CardContent className="p-6 space-y-4">
                  {/* Icon - Enhanced */}
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity ${feature.glowColor}`} />
                    <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-text-primary drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Content - Enhanced */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-text-primary">{feature.title}</h3>
                    <p className="text-sm text-text-body leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative Element - Enhanced */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
