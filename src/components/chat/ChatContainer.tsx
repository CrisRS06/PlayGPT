"use client"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { ChatMessage, type Message } from "./ChatMessage"
import { Skeleton } from "@/components/ui/skeleton"
import { SuggestedPrompts } from "./SuggestedPrompts"
import { useInView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown } from "lucide-react"

interface ChatContainerProps {
  messages: Message[]
  isLoading?: boolean
  onSendMessage?: (content: string) => void
}

export function ChatContainer({ messages, isLoading, onSendMessage }: ChatContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [userScrolledUp, setUserScrolledUp] = useState(false)

  // Invisible anchor at bottom for scroll detection
  const { ref: bottomRef, inView: isAtBottom } = useInView({
    threshold: 0,
    rootMargin: '0px 0px 50px 0px', // Trigger slightly before actual bottom
  })

  // Detect when user scrolls up
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    // User scrolled up more than 100px
    if (distanceFromBottom > 100) {
      setUserScrolledUp(true)
    } else {
      setUserScrolledUp(false)
    }
  }, [])

  // Throttle scroll events (fire every 100ms max)
  const throttledScroll = useMemo(() => {
    let timeoutId: NodeJS.Timeout | null = null
    return () => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          handleScroll()
          timeoutId = null
        }, 100)
      }
    }
  }, [handleScroll])

  // Only auto-scroll if user is at bottom
  useEffect(() => {
    if (!userScrolledUp && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isLoading, userScrolledUp])

  // Scroll to bottom function for button
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      })
      setUserScrolledUp(false)
    }
  }

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
    <div className="flex-1 relative">
      <div
        ref={scrollAreaRef}
        className="h-full overflow-y-auto"
        onScroll={throttledScroll}
      >
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

          {/* Invisible anchor for scroll detection */}
          <div ref={bottomRef} className="h-px" />
        </div>
      </div>

      {/* Scroll to bottom button (only when user scrolled up) */}
      <AnimatePresence>
        {userScrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToBottom}
            className="absolute bottom-6 right-6 bg-primary text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform z-10 touch-target"
            aria-label="Volver abajo"
          >
            <ArrowDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
