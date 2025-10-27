"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChatContainer } from "@/components/chat/ChatContainer"
import { ChatInput } from "@/components/chat/ChatInput"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import type { Message } from "@/components/chat/ChatMessage"
import { saveConversationAction, loadConversationAction } from "@/lib/chat/conversation-actions"
import { ConversationSidebar } from "@/components/chat/ConversationSidebar"
import { LearningPathSidebar } from "@/components/learning/LearningPathSidebar"
import { XPProgressBar } from "@/components/gamification/XPProgressBar"
import { StreakIndicator } from "@/components/gamification/StreakIndicator"
import { AchievementToast } from "@/components/gamification/AchievementToast"
import { ModeToggle } from "@/components/learning/ModeToggle"
import { QuickActions } from "@/components/chat/QuickActions"
import { OnboardingTour } from "@/components/onboarding/OnboardingTour"
import { ChatHeaderMenu } from "@/components/chat/ChatHeaderMenu"
import { useGamificationStore } from "@/stores/gamification-store"
import { GuidedProgressBar } from "@/components/learning/GuidedProgressBar"
import { GuidedSessionControl } from "@/components/learning/GuidedSessionControl"
import { useLearningModeStore } from "@/stores/learning-mode-store"

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [learningPathOpen, setLearningPathOpen] = useState(false)
  const { currentAchievement, clearCurrentAchievement } = useGamificationStore()
  const { mode } = useLearningModeStore()
  const isGuidedMode = mode === 'guided'

  // Save conversation after messages update
  useEffect(() => {
    async function saveCurrentConversation() {
      if (messages.length > 0) {
        try {
          const conversationId = await saveConversationAction(messages, currentConversationId || undefined)
          if (!currentConversationId) {
            setCurrentConversationId(conversationId)
          }
        } catch (err) {
          // Silent fail - conversation auto-save is not critical
        }
      }
    }
    saveCurrentConversation()
  }, [messages, currentConversationId])

  const handleNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
    setSidebarOpen(false)
  }

  const handleLoadConversation = async (conversationId: string) => {
    const conversation = await loadConversationAction(conversationId)
    if (conversation) {
      setMessages(conversation.messages)
      setCurrentConversationId(conversationId)
      setSidebarOpen(false)
    }
  }

  // Handlers to ensure only one sidebar is open at a time
  const handleToggleConversationSidebar = () => {
    if (!sidebarOpen && learningPathOpen) {
      setLearningPathOpen(false)
    }
    setSidebarOpen(!sidebarOpen)
  }

  const handleToggleLearningPath = () => {
    if (!learningPathOpen && sidebarOpen) {
      setSidebarOpen(false)
    }
    setLearningPathOpen(!learningPathOpen)
  }

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      // Read the stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No reader available")
      }

      let assistantMessage = ""
      const assistantMessageId = (Date.now() + 1).toString()

      // Add empty assistant message first
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant" as const,
          content: "",
          timestamp: new Date(),
        },
      ])

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        // Decode the chunk directly (Vercel AI SDK v3 uses plain text streaming)
        const chunk = decoder.decode(value, { stream: true })
        assistantMessage += chunk

        // Update message in real-time
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: assistantMessage }
              : m
          )
        )
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen-mobile bg-gray-50 text-gray-900">
      {/* Onboarding Tour */}
      <OnboardingTour />

      {/* Achievement Toast */}
      <AchievementToast
        achievement={currentAchievement}
        onClose={clearCurrentAchievement}
      />

      {/* Learning Path Sidebar */}
      <LearningPathSidebar
        isOpen={learningPathOpen}
        onClose={() => setLearningPathOpen(false)}
      />

      {/* Conversation Sidebar */}
      <ConversationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectConversation={handleLoadConversation}
        onNewConversation={handleNewConversation}
        currentConversationId={currentConversationId}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-gray-200 backdrop-blur-xl bg-white/90 px-4 py-3 md:px-6 md:py-4"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Left Section: Menu + Logo */}
            <div className="flex items-center gap-3">
              {/* Hamburger Menu - Mobile Only */}
              <ChatHeaderMenu
                onOpenHistorial={handleToggleConversationSidebar}
                onOpenAprendizaje={handleToggleLearningPath}
              />

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-lg opacity-50" />
                  <Sparkles className="relative h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-semibold text-gray-900">PlayGPT EDU</h1>
                  <p className="text-xs text-gray-600">Asistente de Aprendizaje</p>
                </div>
              </Link>
            </div>

            {/* Right Section: Desktop Stats */}
            <div className="hidden md:flex items-center gap-3">
              <ModeToggle compact />
              <Separator orientation="vertical" className="h-6" />
              <XPProgressBar compact />
              <Separator orientation="vertical" className="h-6" />
              <StreakIndicator compact />
            </div>
          </div>
        </motion.header>

        {/* Guided Learning Progress Bar (only in guided mode) */}
        {isGuidedMode && <GuidedProgressBar />}

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Guided Session Control (only in guided mode) */}
        {isGuidedMode && (
          <div className="px-4 pt-4">
            <GuidedSessionControl />
          </div>
        )}

        {/* Messages */}
        <ChatContainer messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-xl p-6">
          <div className="mx-auto max-w-4xl">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <p className="font-medium">Error al procesar el mensaje</p>
                <p className="text-xs mt-1 opacity-80">{error.message}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
