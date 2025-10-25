"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserConversationsAction, deleteConversationAction } from "@/lib/chat/conversation-actions"
import type { Conversation } from "@/lib/chat/conversation-store"
import { X, Plus, MessageSquare, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface ConversationSidebarProps {
  isOpen: boolean
  onClose: () => void
  onSelectConversation: (conversationId: string) => void
  onNewConversation: () => void
  currentConversationId: string | null
}

export function ConversationSidebar({
  isOpen,
  onClose,
  onSelectConversation,
  onNewConversation,
  currentConversationId,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadConversations() {
      setIsLoading(true)
      const convos = await getUserConversationsAction()
      setConversations(convos)
      setIsLoading(false)
    }
    if (isOpen) {
      loadConversations()
    }
  }, [isOpen])

  // Keyboard navigation: Escape closes sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleDelete = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    toast.loading("Eliminando conversación...", { id: "delete-conversation" })

    const success = await deleteConversationAction(conversationId)
    if (success) {
      setConversations(conversations.filter((c) => c.id !== conversationId))
      if (currentConversationId === conversationId) {
        onNewConversation()
      }
      toast.success("Conversación eliminada", { id: "delete-conversation" })
    } else {
      toast.error("Error al eliminar la conversación", { id: "delete-conversation" })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 md:hidden"
            data-backdrop
            tabIndex={-1}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed md:relative left-0 top-0 h-full w-full sm:w-80 max-w-xs bg-white/95 border-r border-gray-200 backdrop-blur-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">Conversaciones</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="md:hidden"
                  aria-label="Cerrar menú de conversaciones"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Button
                onClick={onNewConversation}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Conversación
              </Button>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1 p-2">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-lg bg-white/5 animate-pulse"
                    />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageSquare className="h-12 w-12 text-text-tertiary mb-4" />
                  <p className="text-sm text-text-secondary">
                    No hay conversaciones guardadas
                  </p>
                  <p className="text-xs text-text-tertiary mt-2">
                    Inicia una nueva conversación para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conversation) => {
                    const isActive = currentConversationId === conversation.id
                    const title =
                      conversation.metadata?.title || "Conversación sin título"
                    const updatedAt = conversation.metadata?.updated_at
                      ? new Date(conversation.metadata.updated_at)
                      : new Date()

                    return (
                      <motion.div
                        key={conversation.id}
                        onClick={() => onSelectConversation(conversation.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors group relative cursor-pointer ${
                          isActive
                            ? "bg-primary/20 border border-primary/30"
                            : "bg-white/5 hover:bg-white border border-transparent"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            onSelectConversation(conversation.id)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`text-sm font-medium truncate ${
                                isActive ? "text-text-primary" : "text-text-body"
                              }`}
                            >
                              {title}
                            </h3>
                            <p className="text-xs text-text-tertiary mt-1">
                              {conversation.messages.length} mensajes
                            </p>
                            <p className="text-xs text-text-tertiary mt-1">
                              {formatDistanceToNow(updatedAt, {
                                addSuffix: true,
                                locale: es,
                              })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDelete(conversation.id, e)}
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                            aria-label={`Eliminar conversación: ${title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
