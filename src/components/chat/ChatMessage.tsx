"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sparkles, User, Brain, Calculator, TrendingUp, DollarSign, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useGamificationStore } from "@/stores/gamification-store"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    category?: string
    difficulty?: string
    xpAwarded?: number
  }
}

interface ChatMessageProps {
  message: Message
}

// Content analysis for automatic categorization
function analyzeMessageContent(content: string): {
  category: string | null
  difficulty: string | null
  icon: typeof Brain | null
} {
  const lowerContent = content.toLowerCase()

  // Category detection based on keywords
  let category: string | null = null
  let icon: typeof Brain | null = null

  if (
    lowerContent.includes("probabilidad") ||
    lowerContent.includes("valor esperado") ||
    lowerContent.includes("odds") ||
    lowerContent.includes("ev") ||
    lowerContent.includes("esperanza matemática")
  ) {
    category = "Probabilidad"
    icon = Calculator
  } else if (
    lowerContent.includes("bankroll") ||
    lowerContent.includes("kelly") ||
    lowerContent.includes("gestión de dinero") ||
    lowerContent.includes("capital") ||
    lowerContent.includes("unit sizing")
  ) {
    category = "Bankroll"
    icon = DollarSign
  } else if (
    lowerContent.includes("psicología") ||
    lowerContent.includes("sesgo") ||
    lowerContent.includes("falacia") ||
    lowerContent.includes("tilt") ||
    lowerContent.includes("emocional") ||
    lowerContent.includes("cognitivo")
  ) {
    category = "Psicología"
    icon = Brain
  } else if (
    lowerContent.includes("estrategia") ||
    lowerContent.includes("apuesta") ||
    lowerContent.includes("parlay") ||
    lowerContent.includes("hedge") ||
    lowerContent.includes("arbitraje")
  ) {
    category = "Estrategia"
    icon = TrendingUp
  }

  // Difficulty detection (basic heuristic)
  let difficulty: string | null = null
  if (lowerContent.length < 100) {
    difficulty = "Básico"
  } else if (lowerContent.length < 300) {
    difficulty = "Intermedio"
  } else {
    difficulty = "Avanzado"
  }

  return { category, difficulty, icon }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant"
  const { addXP } = useGamificationStore()
  const [xpAwarded, setXpAwarded] = useState(false)

  // Analyze content for categorization
  const analysis = analyzeMessageContent(message.content)
  const category = message.metadata?.category || analysis.category
  const difficulty = message.metadata?.difficulty || analysis.difficulty
  const Icon = analysis.icon

  // Award XP for assistant messages (educational content)
  useEffect(() => {
    if (isAssistant && !xpAwarded && message.content.length > 50) {
      // Award XP for chat interaction
      const xp = message.metadata?.xpAwarded || 2 // Default 2 XP per message
      addXP(xp, "Interacción en el chat")
      setXpAwarded(true)
    }
  }, [isAssistant, message.content, xpAwarded, addXP, message.metadata?.xpAwarded])

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Probabilidad":
        return "bg-blue-500/10 text-info border-blue-500/20"
      case "Estrategia":
        return "bg-purple-500/10 text-icon-primary border-purple-500/20"
      case "Psicología":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20"
      case "Bankroll":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      default:
        return "bg-gray-500/10 text-text-secondary border-gray-500/20"
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Básico":
        return "bg-green-500/10 text-success border-green-500/20"
      case "Intermedio":
        return "bg-yellow-500/10 text-warning border-yellow-500/20"
      case "Avanzado":
        return "bg-red-500/10 text-error border-red-500/20"
      default:
        return "bg-gray-500/10 text-text-secondary border-gray-500/20"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-4 px-6 py-4",
        isAssistant && "bg-gray-100"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback
          className={cn(
            "border",
            isAssistant
              ? "bg-gradient-to-br from-primary to-accent text-text-primary border-primary/50"
              : "bg-gradient-to-br from-secondary to-chart-1 text-text-primary border-secondary/50"
          )}
        >
          {isAssistant ? (
            <Sparkles className="h-5 w-5" />
          ) : (
            <User className="h-5 w-5" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold">
            {isAssistant ? "PlayGPT EDU" : "Tú"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {/* Personalization Badges - Only for assistant messages */}
          {isAssistant && (
            <div className="flex items-center gap-1.5 ml-auto">
              {category && Icon && (
                <Badge
                  variant="outline"
                  className={cn("text-xs flex items-center gap-1", getCategoryColor(category))}
                >
                  <Icon className="w-3 h-3" />
                  {category}
                </Badge>
              )}
              {difficulty && (
                <Badge
                  variant="outline"
                  className={cn("text-xs", getDifficultyColor(difficulty))}
                >
                  {difficulty}
                </Badge>
              )}
              {xpAwarded && (
                <Badge
                  variant="outline"
                  className="text-xs bg-primary/10 text-primary border-primary/20 flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  +{message.metadata?.xpAwarded || 2} XP
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="text-sm leading-relaxed text-gray-900"
            components={{
              // Inline code
              code({ node, inline, className, children, ...props }: any) {
                if (inline) {
                  return (
                    <code
                      className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono text-primary"
                      {...props}
                    >
                      {children}
                    </code>
                  )
                }

                // Block code
                return (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3">
                    <code className="text-sm font-mono" {...props}>
                      {children}
                    </code>
                  </pre>
                )
              },

              // Lists with better spacing
              ul({ children }) {
                return <ul className="list-disc list-inside space-y-1 my-2 text-gray-900">{children}</ul>
              },

              ol({ children }) {
                return <ol className="list-decimal list-inside space-y-1 my-2 text-gray-900">{children}</ol>
              },

              // Paragraphs with proper spacing
              p({ children }) {
                return <p className="mb-3 last:mb-0 text-gray-900">{children}</p>
              },

              // Headings
              h1({ children }) {
                return <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900">{children}</h1>
              },

              h2({ children }) {
                return <h2 className="text-lg font-bold mt-4 mb-2 text-gray-900">{children}</h2>
              },

              h3({ children }) {
                return <h3 className="text-base font-bold mt-3 mb-2 text-gray-900">{children}</h3>
              },

              // Bold text
              strong({ children }) {
                return <strong className="font-bold text-gray-900">{children}</strong>
              },

              // Links
              a({ children, href }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {children}
                  </a>
                )
              },

              // Blockquotes
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 my-3">
                    {children}
                  </blockquote>
                )
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  )
}
