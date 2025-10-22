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
    bgGradient: "from-primary/20 to-accent/20",
  },
  {
    icon: Lightbulb,
    title: "Probabilidad Básica",
    module: "Módulo 1: Fundamentos",
    topics: ["Teoría de probabilidad", "Eventos independientes", "Distribuciones"],
    color: "from-accent to-secondary",
    bgGradient: "from-accent/20 to-secondary/20",
  },
  {
    icon: Brain,
    title: "Sesgos Cognitivos",
    module: "Módulo 1: Fundamentos",
    topics: ["Gamblers fallacy", "Hot hand fallacy", "Toma de decisiones"],
    color: "from-secondary to-chart-1",
    bgGradient: "from-secondary/20 to-chart-1/20",
  },
  {
    icon: DollarSign,
    title: "Gestión de Bankroll",
    module: "Módulo 2: Estrategia",
    topics: ["Kelly Criterion", "Gestión de riesgo", "Planificación financiera"],
    color: "from-chart-1 to-primary",
    bgGradient: "from-chart-1/20 to-primary/20",
  },
]

export function Modules() {
  return (
    <section id="modules" className="relative py-24 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

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
            Módulos de Aprendizaje
          </h2>
          <p className="text-lg text-gray-300">
            Contenido estructurado y curado por expertos para un aprendizaje progresivo
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${module.bgGradient} rounded-full filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`} />

                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    {/* Icon */}
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${module.color} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
                      <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                        <module.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    {/* Module Badge */}
                    <Badge
                      variant="outline"
                      className="border-primary/40 bg-primary/20 text-white font-medium backdrop-blur-sm"
                    >
                      {module.module}
                    </Badge>
                  </div>

                  <CardTitle className="text-2xl text-white">{module.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Topics List */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-300">
                      Temas clave:
                    </p>
                    <ul className="space-y-2">
                      {module.topics.map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${module.color}`} />
                          <span className="text-gray-200">{topic}</span>
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
