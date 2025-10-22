/**
 * Search API Endpoint
 * POST /api/search
 *
 * Performs vector similarity search on the knowledge base
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchDocuments, formatSearchResultsAsContext } from '@/lib/rag/search'

export const runtime = 'nodejs' // Use Node.js runtime for OpenAI SDK

interface SearchRequest {
  query: string
  matchThreshold?: number
  matchCount?: number
  filterModule?: string
  format?: 'raw' | 'context' // raw = full results, context = formatted for LLM
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()

    // Validation
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "query" parameter' },
        { status: 400 }
      )
    }

    if (body.query.trim().length < 3) {
      return NextResponse.json(
        { error: 'Query must be at least 3 characters long' },
        { status: 400 }
      )
    }

    // Search with options
    const results = await searchDocuments(body.query, {
      matchThreshold: body.matchThreshold,
      matchCount: body.matchCount,
      filterModule: body.filterModule,
    })

    // Return formatted response
    if (body.format === 'context') {
      // Format as context string for LLM prompts
      const context = formatSearchResultsAsContext(results)
      return NextResponse.json({
        query: body.query,
        context,
        resultCount: results.length,
      })
    } else {
      // Return raw results (default)
      return NextResponse.json({
        query: body.query,
        results,
        resultCount: results.length,
      })
    }
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to perform search',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint for simple queries
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || searchParams.get('query')

  if (!query) {
    return NextResponse.json(
      { error: 'Missing query parameter (use ?q=your+query)' },
      { status: 400 }
    )
  }

  try {
    const results = await searchDocuments(query, {
      matchCount: parseInt(searchParams.get('count') || '5'),
      matchThreshold: parseFloat(searchParams.get('threshold') || '0.7'),
    })

    return NextResponse.json({
      query,
      results,
      resultCount: results.length,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to perform search',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
