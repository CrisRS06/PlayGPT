/**
 * RAG Search Testing Script
 *
 * Tests the retrieval system with various queries
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { searchDocumentsVerbose, formatSearchResultsAsContext } from '../src/lib/rag/search'

// Test queries
const TEST_QUERIES = [
  {
    query: "What is expected value and how do I calculate it?",
    description: "Basic EV question"
  },
  {
    query: "How should I manage my bankroll when betting?",
    description: "Bankroll management"
  },
  {
    query: "What is the gambler's fallacy?",
    description: "Cognitive bias"
  },
  {
    query: "How do I convert betting odds to probability?",
    description: "Probability conversion"
  },
  {
    query: "What bet sizing strategy should I use?",
    description: "Kelly Criterion / bet sizing"
  },
]

async function runTests() {
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║           RAG Search System - Test Suite                ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  const results: Array<{
    query: string
    description: string
    resultCount: number
    topSimilarity: number
    topics: string[]
  }> = []

  for (const test of TEST_QUERIES) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`TEST: ${test.description}`)
    console.log(`QUERY: "${test.query}"`)
    console.log('='.repeat(60))

    try {
      const searchResults = await searchDocumentsVerbose(test.query, {
        matchCount: 3,
        matchThreshold: 0.5,
      })

      // Collect statistics
      const topics = new Set<string>()
      searchResults.forEach(r => topics.add(r.metadata.topic))

      results.push({
        query: test.query,
        description: test.description,
        resultCount: searchResults.length,
        topSimilarity: searchResults.length > 0 ? searchResults[0].similarity : 0,
        topics: Array.from(topics),
      })

      // Show formatted context
      console.log('\n📝 FORMATTED CONTEXT (for LLM):')
      console.log('-'.repeat(60))
      const context = formatSearchResultsAsContext(searchResults)
      console.log(context.substring(0, 500) + '...\n')

    } catch (error) {
      console.error(`❌ Test failed: ${error}`)
      results.push({
        query: test.query,
        description: test.description,
        resultCount: 0,
        topSimilarity: 0,
        topics: [],
      })
    }

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Summary
  console.log('\n\n╔══════════════════════════════════════════════════════════╗')
  console.log('║                     TEST SUMMARY                         ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.description}`)
    console.log(`   Results: ${result.resultCount}`)
    console.log(`   Top similarity: ${(result.topSimilarity * 100).toFixed(1)}%`)
    console.log(`   Topics found: ${result.topics.join(', ') || 'None'}`)
    console.log()
  })

  // Overall stats
  const totalResults = results.reduce((sum, r) => sum + r.resultCount, 0)
  const avgSimilarity = results.reduce((sum, r) => sum + r.topSimilarity, 0) / results.length
  const successRate = results.filter(r => r.resultCount > 0).length / results.length

  console.log('📊 Overall Statistics:')
  console.log(`   Tests run: ${results.length}`)
  console.log(`   Success rate: ${(successRate * 100).toFixed(1)}%`)
  console.log(`   Total results: ${totalResults}`)
  console.log(`   Avg top similarity: ${(avgSimilarity * 100).toFixed(1)}%`)

  console.log('\n✅ Testing complete!')
}

runTests()
