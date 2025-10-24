"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, Trophy } from "lucide-react"
import { use } from "react"
import { toast } from "sonner"

interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  blooms_level: string
}

interface Quiz {
  id: string
  topic: string
  blooms_level: string
  questions: QuizQuestion[]
}

export default function QuizTakePage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = use(params)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<{
    score: number
    evaluations: Array<{ correct: boolean; explanation: string }>
    correctAnswers: number
    totalQuestions: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadQuiz() {
      try {
        const response = await fetch(`/api/quiz/${quizId}`)

        if (!response.ok) {
          throw new Error("Quiz not found")
        }

        const data = await response.json()
        setQuiz(data)
        setUserAnswers(new Array(data.questions.length).fill(-1))
      } catch (err) {
        setError("Error al cargar el quiz")
        toast.error("No se pudo cargar el quiz. Por favor intenta de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    loadQuiz()
  }, [quizId])

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (userAnswers.some((a) => a === -1)) {
      setError("Por favor responde todas las preguntas antes de enviar")
      toast.error("Por favor responde todas las preguntas antes de enviar")
      return
    }

    setIsSubmitting(true)
    setError(null)

    toast.loading("Evaluando tus respuestas...", { id: "quiz-submit" })

    try {
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: userAnswers }),
      })

      if (!response.ok) {
        throw new Error("Error submitting quiz")
      }

      const data = await response.json()
      setResults(data)

      const percentage = (data.score * 100).toFixed(0)
      toast.success(`¡Quiz completado! Obtuviste ${percentage}%`, { id: "quiz-submit" })
    } catch (err) {
      setError("Error al enviar el quiz")
      toast.error("Error al enviar el quiz. Por favor intenta de nuevo.", { id: "quiz-submit" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando quiz...</p>
        </div>
      </div>
    )
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="border-destructive/20 bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
            <Button className="mt-4" asChild>
              <Link href="/quizzes">Volver a Quizzes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quiz) return null

  // Results View
  if (results) {
    const percentage = (results.score * 100).toFixed(0)
    const passed = results.score >= 0.7

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild aria-label="Volver a quizzes">
                <Link href="/quizzes">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Resultados del Quiz</h1>
                <p className="text-sm text-gray-400">{quiz.topic}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-6">
                  {passed ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl" />
                      <Trophy className="relative h-24 w-24 text-green-500 mx-auto" />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl" />
                      <Trophy className="relative h-24 w-24 text-orange-500 mx-auto" />
                    </div>
                  )}
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">{percentage}%</h2>
                <p className="text-gray-400">
                  {results.correctAnswers} de {results.totalQuestions} preguntas correctas
                </p>
                <Badge
                  className={`mt-4 ${
                    passed
                      ? "bg-green-500/20 text-green-500 border-green-500/30"
                      : "bg-orange-500/20 text-orange-500 border-orange-500/30"
                  }`}
                  variant="outline"
                >
                  {passed ? "¡Aprobado!" : "Necesitas practicar más"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const evaluation = results.evaluations[index]
                  const userAnswer = userAnswers[index]

                  return (
                    <div
                      key={question.id || `question-${index}`}
                      className={`p-6 rounded-lg border ${
                        evaluation.correct
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        {evaluation.correct ? (
                          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-2">
                            Pregunta {index + 1}
                          </h3>
                          <p className="text-gray-300 mb-4">{question.question}</p>

                          <div className="space-y-2 mb-4">
                            {question.options.map((option, optionIndex) => {
                              const isCorrect = optionIndex === question.correct_answer
                              const isUserAnswer = optionIndex === userAnswer

                              return (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    isCorrect
                                      ? "border-green-500/50 bg-green-500/10"
                                      : isUserAnswer
                                        ? "border-red-500/50 bg-red-500/10"
                                        : "border-white/10 bg-white/5"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-white">{option}</span>
                                    {isCorrect && (
                                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                                    )}
                                    {isUserAnswer && !isCorrect && (
                                      <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                            <p className="text-sm text-blue-300">
                              <strong>Explicación:</strong> {evaluation.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="flex gap-4 pt-6">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/quizzes">Tomar Otro Quiz</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/profile">Ver Mi Perfil</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Quiz Taking View
  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const allAnswered = userAnswers.every((a) => a !== -1)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/quizzes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{quiz.topic}</h1>
              <p className="text-sm text-gray-400">
                Pregunta {currentQuestion + 1} de {quiz.questions.length}
              </p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl leading-relaxed">
                  {currentQ.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQ.options.map((option, index) => (
                  <button
                    key={typeof option === 'string' ? option : `option-${index}`}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      userAnswers[currentQuestion] === index
                        ? "border-primary bg-primary/20 scale-[1.02]"
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          userAnswers[currentQuestion] === index
                            ? "border-primary bg-primary"
                            : "border-white/30"
                        }`}
                      >
                        {userAnswers[currentQuestion] === index && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-white">{option}</span>
                    </div>
                  </button>
                ))}

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="flex-1"
                  >
                    Anterior
                  </Button>
                  {currentQuestion < quiz.questions.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={userAnswers[currentQuestion] === -1}
                      className="flex-1"
                    >
                      Siguiente
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!allAnswered || isSubmitting}
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Quiz"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
