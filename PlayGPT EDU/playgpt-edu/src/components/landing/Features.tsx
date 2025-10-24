"use client"

import { motion } from "framer-motion"
import { Brain, MessageSquare, TrendingUp, Shield, Zap, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "IA Avanzada",
    description: "Utiliza modelos de lenguaje de última generación para proporcionar explicaciones personalizadas y adaptativas.",
    gradient: "from-primary/20 to-accent/20",
    iconColor: "text-primary",
  },
  {
    icon: MessageSquare,
    title: "Chat Interactivo",
    description: "Aprende mediante conversaciones naturales. Pregunta lo que quieras y recibe respuestas contextualizadas.",
    gradient: "from-accent/20 to-secondary/20",
    iconColor: "text-accent",
  },
  {
    icon: TrendingUp,
    title: "Aprendizaje Adaptativo",
    description: "El sistema se adapta a tu nivel y ritmo de aprendizaje para maximizar tu progreso.",
    gradient: "from-secondary/20 to-chart-1/20",
    iconColor: "text-secondary",
  },
  {
    icon: Shield,
    title: "Juego Responsable",
    description: "Enfoque científico en probabilidad, valor esperado y gestión de riesgos basado en evidencia.",
    gradient: "from-chart-1/20 to-chart-2/20",
    iconColor: "text-chart-1",
  },
  {
    icon: Zap,
    title: "Resultados Rápidos",
    description: "Sistema RAG que proporciona respuestas precisas basadas en nuestra base de conocimiento curada.",
    gradient: "from-chart-2/20 to-primary/20",
    iconColor: "text-chart-2",
  },
  {
    icon: Target,
    title: "Evaluación Continua",
    description: "Quizzes dinámicos generados por IA para evaluar tu comprensión y reforzar conceptos clave.",
    gradient: "from-primary/20 to-accent/20",
    iconColor: "text-primary",
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
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Características Principales
          </h2>
          <p className="text-lg text-gray-300">
            Tecnología de vanguardia para una experiencia de aprendizaje única y efectiva
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="group relative h-full overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                    <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                      <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
