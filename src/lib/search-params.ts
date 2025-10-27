import { parseAsString, parseAsBoolean, createSearchParamsCache } from 'nuqs'

/**
 * Available module IDs for deep linking
 * These correspond to the module IDs in learning-progress-store.ts
 */
export const MODULE_IDS = [
  'module-1-foundations',
  'module-2-sports-betting',
  'module-3-bankroll',
  'module-4-psychology',
] as const

export type ModuleId = typeof MODULE_IDS[number]

/**
 * Module slug mapping for user-friendly URLs
 * Maps SEO-friendly slugs to internal module IDs
 */
export const MODULE_SLUGS: Record<string, ModuleId> = {
  'fundamentos': 'module-1-foundations',
  'probabilidad': 'module-1-foundations',
  'valor-esperado': 'module-1-foundations',
  'sesgos-cognitivos': 'module-1-foundations',
  'apuestas-deportivas': 'module-2-sports-betting',
  'sports-betting': 'module-2-sports-betting',
  'gestion-bankroll': 'module-3-bankroll',
  'bankroll': 'module-3-bankroll',
  'kelly-criterion': 'module-3-bankroll',
  'psicologia': 'module-4-psychology',
  'psychology': 'module-4-psychology',
  'control-emocional': 'module-4-psychology',
} as const

export type ModuleSlug = keyof typeof MODULE_SLUGS

/**
 * Reverse mapping for generating user-friendly URLs
 */
export const MODULE_ID_TO_SLUG: Record<ModuleId, string> = {
  'module-1-foundations': 'fundamentos',
  'module-2-sports-betting': 'apuestas-deportivas',
  'module-3-bankroll': 'gestion-bankroll',
  'module-4-psychology': 'psicologia',
}

/**
 * Chat page URL parameters
 */
export const chatSearchParams = {
  // Module deep linking - accepts both slugs and IDs
  module: parseAsString.withDefault(''),

  // Topic suggestion for initial message
  topic: parseAsString.withDefault(''),

  // Whether to show suggestion banner
  suggest: parseAsBoolean.withDefault(false),

  // Conversation ID for loading specific chats
  conversation: parseAsString.withDefault(''),
}

/**
 * Server-side cache for chat search params
 * Use this in Server Components
 */
export const chatSearchParamsCache = createSearchParamsCache(chatSearchParams)

/**
 * Helper function to convert module slug to ID
 */
export function moduleSlugToId(slug: string): ModuleId | null {
  return MODULE_SLUGS[slug as ModuleSlug] || null
}

/**
 * Helper function to convert module ID to slug
 */
export function moduleIdToSlug(moduleId: ModuleId): string {
  return MODULE_ID_TO_SLUG[moduleId] || moduleId
}

/**
 * Helper to validate if a string is a valid module identifier
 */
export function isValidModuleIdentifier(value: string): boolean {
  return MODULE_IDS.includes(value as ModuleId) || value in MODULE_SLUGS
}

/**
 * Get user-friendly module name from slug or ID
 */
export function getModuleName(identifier: string): string {
  const moduleNames: Record<ModuleId, string> = {
    'module-1-foundations': 'Fundamentos',
    'module-2-sports-betting': 'Apuestas Deportivas',
    'module-3-bankroll': 'Gestión de Bankroll',
    'module-4-psychology': 'Psicología',
  }

  const moduleId = moduleSlugToId(identifier) || identifier as ModuleId
  return moduleNames[moduleId] || identifier
}
