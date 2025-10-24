"use server"

import { saveConversation as saveConversationDB, loadConversation as loadConversationDB, getUserConversations as getUserConversationsDB, deleteConversation as deleteConversationDB, type Message } from "./conversation-store"
import { getUser } from "@/lib/auth/actions"

export async function saveConversationAction(messages: Message[], conversationId?: string) {
  const user = await getUser()
  if (!user) throw new Error("Unauthorized")

  return await saveConversationDB(user.id, messages, conversationId)
}

export async function loadConversationAction(conversationId: string) {
  const user = await getUser()
  if (!user) throw new Error("Unauthorized")

  return await loadConversationDB(conversationId)
}

export async function getUserConversationsAction() {
  const user = await getUser()
  if (!user) return []

  return await getUserConversationsDB(user.id)
}

export async function deleteConversationAction(conversationId: string) {
  const user = await getUser()
  if (!user) throw new Error("Unauthorized")

  return await deleteConversationDB(conversationId)
}
