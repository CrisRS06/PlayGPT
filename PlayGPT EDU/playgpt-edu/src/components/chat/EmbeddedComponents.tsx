"use client"

import { motion } from "framer-motion"
import { EVCalculator } from "@/components/interactive/EVCalculator"
import { InlineQuiz, type QuizQuestion } from "@/components/interactive/InlineQuiz"
import { BettingSimulator } from "@/components/interactive/BettingSimulator"
import { KnowledgeProgressChart } from "@/components/interactive/KnowledgeProgressChart"

export type EmbeddedComponentType = "ev-calculator" | "inline-quiz" | "betting-simulator" | "knowledge-chart"

interface EmbeddedComponentProps {
  type: EmbeddedComponentType
  data?: any
}

export function EmbeddedComponent({ type, data }: EmbeddedComponentProps) {
  const renderComponent = () => {
    switch (type) {
      case "ev-calculator":
        return <EVCalculator />

      case "inline-quiz":
        const questions = data?.questions as QuizQuestion[] || []
        const title = data?.title || "Quiz Interactivo"
        const onComplete = data?.onComplete
        return (
          <InlineQuiz
            questions={questions}
            title={title}
            onComplete={onComplete}
          />
        )

      case "betting-simulator":
        return <BettingSimulator />

      case "knowledge-chart":
        const variant = data?.variant || "compact"
        const topics = data?.topics
        return (
          <KnowledgeProgressChart
            variant={variant}
            topics={topics}
          />
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="my-4"
    >
      {renderComponent()}
    </motion.div>
  )
}

// Helper function to parse embedded components from message content
export function parseEmbeddedComponents(content: string): {
  text: string
  components: Array<{
    type: EmbeddedComponentType
    data?: any
    position: number
  }>
} {
  const components: Array<{
    type: EmbeddedComponentType
    data?: any
    position: number
  }> = []

  // Regex to find embedded component markers
  // Format: {{component:type|data}}
  const regex = /\{\{component:([a-z-]+)(?:\|(.*?))?\}\}/g
  let match

  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, type, dataStr] = match
    let data = {}

    try {
      if (dataStr) {
        data = JSON.parse(dataStr)
      }
    } catch (e) {
      // Silent fail - component won't render if data is invalid
    }

    components.push({
      type: type as EmbeddedComponentType,
      data,
      position: match.index
    })
  }

  // Remove component markers from text
  const text = content.replace(regex, '')

  return { text, components }
}
