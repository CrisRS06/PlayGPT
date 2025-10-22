"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Brain, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const topics = [
  "Valor Esperado",
  "Probabilidad Básica",
  "Sesgos Cognitivos",
  "Gestión de Bankroll",
  "Kelly Criterion",
  "Varianza y Desviación Estándar",
  "Toma de Decisiones",
]

export default function QuizzesPage() {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [customTopic, setCustomTopic] = useState("")
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [numberOfQuestions, setNumberOfQuestions] = useState("5")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateQuiz = async () => {
    const selectedTopic = topic === "custom" ? customTopic : topic

    if (!selectedTopic) {
      toast.error("Por favor selecciona un tema")
      setError("Por favor selecciona un tema")
      return
    }

    setIsGenerating(true)
    setError(null)

    toast.loading("Generando quiz personalizado...", { id: "quiz-generation" })

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: selectedTopic,
          level,
          numberOfQuestions: parseInt(numberOfQuestions),
        }),
      })

      if (!response.ok) {
        throw new Error("Error generando el quiz")
      }

      const { quizId } = await response.json()

      toast.success("¡Quiz generado exitosamente! 🎉", { id: "quiz-generation" })

      // Redirect to quiz taking page
      setTimeout(() => {
        router.push(`/quizzes/${quizId}`)
      }, 500)
    } catch (err) {
      console.error("Error generating quiz:", err)
      toast.error("Error al generar el quiz. Por favor intenta de nuevo.", { id: "quiz-generation" })
      setError("Hubo un error al generar el quiz. Por favor intenta de nuevo.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild aria-label="Volver al chat">
              <Link href="/chat">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Quizzes Educativos
              </h1>
              <p className="text-sm text-gray-400">
                Genera quizzes personalizados con IA para evaluar tu conocimiento
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Generar Nuevo Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Selection */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-white">
                  Tema del Quiz
                </Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Selecciona un tema" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {topics.map((t) => (
                      <SelectItem key={t} value={t} className="text-white">
                        {t}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom" className="text-white">
                      Tema personalizado...
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Topic Input */}
              {topic === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customTopic" className="text-white">
                    Tema Personalizado
                  </Label>
                  <Input
                    id="customTopic"
                    placeholder="Ejemplo: Distribuciones de probabilidad"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
              )}

              {/* Difficulty Level */}
              <div className="space-y-2">
                <Label htmlFor="level" className="text-white">
                  Nivel de Dificultad
                </Label>
                <Select value={level} onValueChange={(v: "beginner" | "intermediate" | "advanced") => setLevel(v)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="beginner" className="text-white">
                      Principiante
                    </SelectItem>
                    <SelectItem value="intermediate" className="text-white">
                      Intermedio
                    </SelectItem>
                    <SelectItem value="advanced" className="text-white">
                      Avanzado
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Questions */}
              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions" className="text-white">
                  Número de Preguntas
                </Label>
                <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {[3, 5, 7, 10].map((num) => (
                      <SelectItem
                        key={num}
                        value={num.toString()}
                        className="text-white"
                      >
                        {num} preguntas
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generando Quiz...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Generar Quiz con IA
                  </>
                )}
              </Button>

              {/* Info */}
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>Tip:</strong> La IA generará preguntas personalizadas
                  basadas en el tema y nivel que elijas. Cada quiz es único y se
                  adapta a tus necesidades de aprendizaje.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
