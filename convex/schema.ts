import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Stores user search queries
  queries: defineTable({
    text: v.string(),
    userId: v.string(),
    timestamp: v.number(),
    metadata: v.optional(
      v.object({
        source: v.optional(v.string()),
        category: v.optional(v.string()),
        context: v.optional(v.string()),
      })
    ),
  }).index('by_user', ['userId']),

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
      })
    ),
  }).index('by_query', ['queryId']),

  // Stores user selections/favorites
  selections: defineTable({
    userId: v.string(),
    responseId: v.id('responses'),
    queryId: v.id('queries'),
    timestamp: v.number(),
    isFavorite: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_response', ['responseId']),

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
