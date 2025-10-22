"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, User } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-4 px-6 py-4",
        isAssistant && "bg-white/5"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback
          className={cn(
            "border",
            isAssistant
              ? "bg-gradient-to-br from-primary to-accent text-white border-primary/50"
              : "bg-gradient-to-br from-secondary to-chart-1 text-white border-secondary/50"
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
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {isAssistant ? "PlayGPT EDU" : "Tú"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
