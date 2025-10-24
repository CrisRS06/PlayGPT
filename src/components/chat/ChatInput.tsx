"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  disabled?: boolean
}

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pregúntame sobre probabilidad, valor esperado, sesgos cognitivos..."
          disabled={isLoading || disabled}
          className="min-h-[80px] max-h-[200px] pr-14 resize-none bg-white/5 border-white/10 focus:border-primary/50 focus-visible:ring-primary/50"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading || disabled}
          className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity disabled:opacity-50"
          aria-label={isLoading ? "Enviando mensaje..." : "Enviar mensaje"}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/10">Enter</kbd> para enviar,{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-white/10">Shift + Enter</kbd> para nueva línea
      </p>
    </form>
  )
}
