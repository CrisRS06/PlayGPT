"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { EVCalculator } from "@/components/interactive/EVCalculator"
import { InlineQuiz, type QuizQuestion } from "@/components/interactive/InlineQuiz"
import { BettingSimulator } from "@/components/interactive/BettingSimulator"
import { KnowledgeProgressChart } from "@/components/interactive/KnowledgeProgressChart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample quiz data
const sampleQuiz: QuizQuestion[] = [
  {
    id: "q1",
    question: "¿Qué significa que un juego tenga un 'valor esperado negativo' (EV-)?",
    options: [
      {
        id: "a",
        text: "Ganarás dinero a largo plazo",
        isCorrect: false,
        explanation: "Un EV negativo significa pérdidas a largo plazo, no ganancias."
      },
      {
        id: "b",
        text: "Perderás dinero a largo plazo",
        isCorrect: true,
        explanation: "Correcto. Un valor esperado negativo indica que, en promedio, perderás dinero si juegas repetidamente."
      },
      {
        id: "c",
        text: "El juego es justo",
        isCorrect: false,
        explanation: "Un juego justo tendría un EV de cero, no negativo."
      },
      {
        id: "d",
        text: "No hay ventaja de la casa",
        isCorrect: false,
        explanation: "Un EV negativo indica precisamente que existe ventaja de la casa."
      }
    ],
    bloomLevel: "understand",
    type: "multiple-choice",
    hint: "Piensa en qué significa 'negativo' en términos matemáticos",
    explanation: "El valor esperado (EV) es el promedio de ganancias o pérdidas por apuesta. Un EV negativo significa que el jugador pierde dinero en promedio, lo cual es típico en juegos de casino debido a la ventaja de la casa."
  },
  {
    id: "q2",
    question: "Si apuestas $10 en la ruleta al rojo (probabilidad 48.6%, pago 2x), ¿aproximadamente cuánto esperas perder en promedio por apuesta?",
    options: [
      {
        id: "a",
        text: "$0 (juego justo)",
        isCorrect: false
      },
      {
        id: "b",
        text: "$0.27",
        isCorrect: true,
        explanation: "Correcto. EV = (0.486 × $10) - (0.514 × $10) = -$0.27"
      },
      {
        id: "c",
        text: "$1.00",
        isCorrect: false
      },
      {
        id: "d",
        text: "$5.00",
        isCorrect: false
      }
    ],
    bloomLevel: "apply",
    type: "multiple-choice",
    hint: "Calcula: (Probabilidad de ganar × Ganancia) - (Probabilidad de perder × Pérdida)",
    explanation: "EV = (48.6% × $10) - (51.4% × $10) = $4.86 - $5.14 = -$0.27 por apuesta"
  }
]

// Sample topic mastery data
const sampleTopics = [
  { topic: "Valor Esperado (EV)", mastery: 85, attempts: 12, lastPracticed: "2025-01-15" },
  { topic: "Probabilidades Básicas", mastery: 92, attempts: 15, lastPracticed: "2025-01-14" },
  { topic: "Ventaja de la Casa", mastery: 78, attempts: 9, lastPracticed: "2025-01-13" },
  { topic: "Gestión de Bankroll", mastery: 65, attempts: 7, lastPracticed: "2025-01-12" },
  { topic: "Varianza y Desviación", mastery: 45, attempts: 5, lastPracticed: "2025-01-11" },
  { topic: "Apuestas Deportivas", mastery: 38, attempts: 4, lastPracticed: "2025-01-10" }
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 backdrop-blur-xl bg-black/50 px-6 py-4 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild aria-label="Volver al chat">
                <Link href="/chat">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <div>
                  <h1 className="text-lg font-semibold text-white">Herramientas Interactivas</h1>
                  <p className="text-xs text-gray-400">Aprende jugando con simuladores y calculadoras</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto p-6"
      >
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/5 border border-white/10">
            <TabsTrigger value="calculator">Calculadora EV</TabsTrigger>
            <TabsTrigger value="simulator">Simulador</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="progress">Progreso</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Calculadora de Valor Esperado</h2>
              <p className="text-gray-400 mb-6">
                Calcula el valor esperado de cualquier apuesta y descubre si es favorable o no a largo plazo.
              </p>
            </div>
            <EVCalculator />
          </TabsContent>

          <TabsContent value="simulator" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Simulador de Apuestas</h2>
              <p className="text-gray-400 mb-6">
                Ejecuta miles de apuestas en segundos y visualiza cómo evoluciona tu bankroll con el tiempo.
              </p>
            </div>
            <BettingSimulator />
          </TabsContent>

          <TabsContent value="quiz" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Quiz Interactivo</h2>
              <p className="text-gray-400 mb-6">
                Pon a prueba tus conocimientos sobre juego responsable y conceptos matemáticos.
              </p>
            </div>
            <InlineQuiz
              questions={sampleQuiz}
              title="Conceptos de Valor Esperado"
              onComplete={() => {
                // Quiz completed
              }}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Visualización de Progreso</h2>
              <p className="text-gray-400 mb-6">
                Explora diferentes formas de visualizar tu progreso de aprendizaje.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <KnowledgeProgressChart
                variant="radar"
                topics={sampleTopics}
              />
              <KnowledgeProgressChart
                variant="bar"
                topics={sampleTopics}
              />
            </div>

            <KnowledgeProgressChart
              variant="compact"
              topics={sampleTopics}
            />
          </TabsContent>
        </Tabs>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                Aprende de Forma Interactiva
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Estas herramientas están diseñadas para ayudarte a comprender conceptos complejos de forma práctica.
                Experimenta con diferentes valores, ejecuta simulaciones y visualiza los resultados para desarrollar
                una comprensión profunda del juego responsable y la matemática detrás de las apuestas.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  )
}
