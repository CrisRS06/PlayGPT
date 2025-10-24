/**
 * Conversation Store
 * Handles saving and loading conversations from Supabase
 */

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  user_id: string
  messages: Message[]
  metadata: {
    title?: string
    created_at: string
    updated_at: string
  }
}

/**
 * Message as stored in the database (timestamp is ISO string)
 */
interface MessageDB {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

/**
 * Conversation as stored in the database
 */
interface ConversationDB {
  id: string
  user_id: string
  messages: MessageDB[]
  metadata: {
    title?: string
    created_at: string
    updated_at: string
  }
}

/**
 * Save a conversation to Supabase
 */
export async function saveConversation(
  userId: string,
  messages: Message[],
  conversationId?: string
): Promise<string> {
  const supabase = await createClient()

  // Type-safe conversion for Supabase Json type
  type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[]

  const conversationData = {
    user_id: userId,
    messages: messages as unknown as JsonValue,
    metadata: {
      title: messages[0]?.content.substring(0, 50) || 'Nueva conversación',
      created_at: conversationId ? undefined : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as unknown as JsonValue,
  }

  if (conversationId) {
    // Update existing conversation
    const { error } = await supabase
      .from('conversations')
      .update(conversationData)
      .eq('id', conversationId)

    if (error) {
      logger.error('Error updating conversation:', error)
      throw error
    }

    return conversationId
  } else {
    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert(conversationData)
      .select('id')
      .single()

    if (error) {
      logger.error('Error creating conversation:', error)
      throw error
    }

    return data.id
  }
}

/**
 * Transform a message from DB format (timestamp as string) to frontend format (timestamp as Date)
 */
function transformMessage(dbMessage: MessageDB): Message {
  return {
    id: dbMessage.id,
    role: dbMessage.role,
    content: dbMessage.content,
    timestamp: new Date(dbMessage.timestamp),
  }
}

/**
 * Load a conversation from Supabase
 */
export async function loadConversation(conversationId: string): Promise<Conversation | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (error) {
    logger.error('Error loading conversation:', error)
    return null
  }

  if (!data) return null

  // Transform messages: string timestamps → Date objects
  try {
    const dbConversation = data as unknown as ConversationDB
    const transformedMessages = dbConversation.messages.map(transformMessage)

    return {
      id: dbConversation.id,
      user_id: dbConversation.user_id,
      messages: transformedMessages,
      metadata: dbConversation.metadata,
    }
  } catch (err) {
    logger.error('Error transforming conversation data:', err)
    return null
  }
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('metadata->updated_at', { ascending: false })

  if (error) {
    logger.error('Error loading conversations:', error)
    return []
  }

  if (!data) return []

  // Transform each conversation's messages
  try {
    const dbConversations = data as unknown as ConversationDB[]
    return dbConversations.map(conv => ({
      id: conv.id,
      user_id: conv.user_id,
      messages: conv.messages.map(transformMessage),
      metadata: conv.metadata,
    }))
  } catch (err) {
    logger.error('Error transforming conversations data:', err)
    return []
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)

  if (error) {
    logger.error('Error deleting conversation:', error)
    return false
  }

  return true
}
