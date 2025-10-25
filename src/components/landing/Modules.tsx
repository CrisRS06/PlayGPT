"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Lightbulb, DollarSign, Brain } from "lucide-react"

const modules = [
  {
    icon: Calculator,
    title: "Valor Esperado",
    module: "Módulo 1: Fundamentos",
    topics: ["Concepto de EV", "Cálculo de probabilidades", "Análisis de decisiones"],
    color: "from-primary to-accent",
    bgGradient: "from-primary/30 to-accent/30",
    badgeClass: "border-primary/60 bg-primary/30 text-text-primary font-medium backdrop-blur-sm",
  },
  {
    icon: Lightbulb,
    title: "Probabilidad Básica",
    module: "Módulo 1: Fundamentos",
    topics: ["Teoría de probabilidad", "Eventos independientes", "Distribuciones"],
    color: "from-accent to-info",
    bgGradient: "from-accent/30 to-info/30",
    badgeClass: "border-accent/60 bg-accent/30 text-text-primary font-medium backdrop-blur-sm",
  },
  {
    icon: Brain,
    title: "Sesgos Cognitivos",
    module: "Módulo 1: Fundamentos",
    topics: ["Gamblers fallacy", "Hot hand fallacy", "Toma de decisiones"],
    color: "from-warning to-primary",
    bgGradient: "from-warning/30 to-primary/30",
    badgeClass: "border-warning/60 bg-warning/30 text-text-primary font-medium backdrop-blur-sm",
  },
  {
    icon: DollarSign,
    title: "Gestión de Bankroll",
    module: "Módulo 2: Estrategia",
    topics: ["Kelly Criterion", "Gestión de riesgo", "Planificación financiera"],
    color: "from-success to-accent",
    bgGradient: "from-success/30 to-accent/30",
    badgeClass: "border-success/60 bg-success/30 text-text-primary font-medium backdrop-blur-sm",
  },
]

export function Modules() {
  return (
    <section id="modules" className="relative py-24 px-6 overflow-hidden">
      {/* Background Effects - Enhanced */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/15 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/15 rounded-full filter blur-3xl" />
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
            Módulos de Aprendizaje
          </h2>
          <p className="text-lg text-text-body">
            Contenido estructurado y curado por expertos para un aprendizaje progresivo
          </p>
        </motion.div>

        {/* Modules Grid - Enhanced */}
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-border-strong glass-card hover:border-primary/30 transition-all duration-300 hover-lift hover:shadow-elevated">
                {/* Background Decoration - Enhanced */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${module.bgGradient} rounded-full filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity`} />

                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    {/* Icon - Enhanced */}
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${module.color} rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center border border-gray-300 group-hover:scale-110 transition-transform`}>
                        <module.icon className="w-7 h-7 text-text-primary drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Module Badge - Enhanced */}
                    <Badge
                      variant="outline"
                      className={module.badgeClass}
                    >
                      {module.module}
                    </Badge>
                  </div>

                  <CardTitle className="text-2xl text-text-primary">{module.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Topics List - Enhanced */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-text-secondary">
                      Temas clave:
                    </p>
                    <ul className="space-y-2">
                      {module.topics.map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${module.color} shadow-sm`} />
                          <span className="text-text-body">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
