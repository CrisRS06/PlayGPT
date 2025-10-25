"use client"

import { useRef, useEffect } from "react"
import { ChatMessage, type Message } from "./ChatMessage"
import { Skeleton } from "@/components/ui/skeleton"
import { SuggestedPrompts } from "./SuggestedPrompts"

interface ChatContainerProps {
  messages: Message[]
  isLoading?: boolean
  onSendMessage?: (content: string) => void
}

export function ChatContainer({ messages, isLoading, onSendMessage }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="text-center space-y-8 max-w-3xl w-full">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-4xl">🎓</div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              ¡Comienza tu aprendizaje!
            </h3>
            <p className="text-muted-foreground">
              Hazme cualquier pregunta sobre juego responsable, probabilidad o gestión de bankroll.
            </p>
          </div>

          {/* Suggested Prompts */}
          {onSendMessage && (
            <div className="text-left">
              <SuggestedPrompts onSelectPrompt={onSendMessage} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-0">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex gap-4 px-6 py-4 bg-gray-100">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
