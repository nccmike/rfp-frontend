import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Stores user search queries
  queries: defineTable({
    text: v.string(),
    userId: v.string(),
    timestamp: v.number(),
    embedding: v.optional(v.array(v.number())), // Vector embedding for similarity search
    metadata: v.optional(
      v.object({
        source: v.optional(v.string()),
        category: v.optional(v.string()),
        context: v.optional(v.string()),
        effectivenessScore: v.optional(v.number()),
        searchCount: v.optional(v.number()),
        lastUsed: v.optional(v.number()),
      })
    ),
  })
    .index('by_user', ['userId'])
    .searchIndex('by_text', { searchField: 'text' }),

  // Stores API responses
  responses: defineTable({
    queryId: v.id('queries'),
    content: v.string(),
    source: v.string(),
    timestamp: v.number(),
    metadata: v.optional(
      v.object({
        relevanceScore: v.optional(v.number()),
        category: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        qualityScore: v.optional(v.number()),
        useCount: v.optional(v.number()),
        lastUsed: v.optional(v.number()),
      })
    ),
  })
    .index('by_query', ['queryId'])
    .searchIndex('by_content', { searchField: 'content' }),

  // Stores user selections/favorites
  selections: defineTable({
    userId: v.string(),
    responseId: v.id('responses'),
    queryId: v.id('queries'),
    timestamp: v.number(),
    isFavorite: v.boolean(),
    notes: v.optional(v.string()),
    feedback: v.optional(
      v.object({
        relevanceScore: v.optional(v.number()),
        usefulness: v.optional(v.number()),
        modificationRequired: v.optional(v.boolean()),
        contextAccuracy: v.optional(v.number()),
      })
    ),
  })
    .index('by_user', ['userId'])
    .index('by_response', ['responseId'])
    .index('by_query', ['queryId']),

  // Stores query relationships for similar queries
  queryRelationships: defineTable({
    sourceQueryId: v.id('queries'),
    relatedQueryId: v.id('queries'),
    responseId: v.id('responses'),
    similarityScore: v.number(),
    useCount: v.number(),
    successRate: v.number(),
    metadata: v.optional(
      v.object({
        lastUsed: v.number(),
        userFeedback: v.optional(v.number()),
        matchType: v.string(), // 'semantic', 'keyword', 'user-selected'
      })
    ),
  })
    .index('by_source_query', ['sourceQueryId'])
    .index('by_related_query', ['relatedQueryId'])
    .index('by_success', ['successRate']),

  // Stores tags for organization
  tags: defineTable({
    name: v.string(),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        color: v.optional(v.string()),
        icon: v.optional(v.string()),
      })
    ),
  }).index('by_name', ['name']),
});
