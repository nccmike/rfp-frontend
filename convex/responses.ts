import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

// Save a new API response
export const saveResponse = mutation({
  args: {
    queryId: v.id('queries'),
    content: v.string(),
    source: v.string(),
    metadata: v.optional(
      v.object({
        relevanceScore: v.optional(v.number()),
        category: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Verify the query exists
    const query = await ctx.db.get(args.queryId);
    if (!query) {
      throw new Error('Query not found');
    }

    const responseId = await ctx.db.insert('responses', {
      queryId: args.queryId,
      content: args.content,
      source: args.source,
      timestamp: Date.now(),
      metadata: args.metadata,
    });
    return responseId;
  },
});

// Get responses for a specific query
export const getResponsesByQuery = query({
  args: {
    queryId: v.id('queries'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('responses')
      .withIndex('by_query', (q) => q.eq('queryId', args.queryId))
      .collect();
  },
});

// Get a single response by ID
export const getResponseById = query({
  args: { id: v.id('responses') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update response metadata
export const updateResponseMetadata = mutation({
  args: {
    id: v.id('responses'),
    metadata: v.object({
      relevanceScore: v.optional(v.number()),
      category: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error('Response not found');
    }

    await ctx.db.patch(args.id, {
      metadata: args.metadata,
    });
  },
});
