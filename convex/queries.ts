import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

// Save a new search query
export const saveQuery = mutation({
  args: {
    text: v.string(),
    userId: v.string(),
    metadata: v.optional(
      v.object({
        source: v.optional(v.string()),
        category: v.optional(v.string()),
        context: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const queryId = await ctx.db.insert('queries', {
      text: args.text,
      userId: args.userId,
      timestamp: Date.now(),
      metadata: args.metadata,
    });
    return queryId;
  },
});

// Get query history for a user
export const getQueryHistory = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50; // Default to 50 queries
    return await ctx.db
      .query('queries')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(limit);
  },
});

// Get a single query by ID
export const getQueryById = query({
  args: { id: v.id('queries') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update query metadata
export const updateQueryMetadata = mutation({
  args: {
    id: v.id('queries'),
    metadata: v.object({
      source: v.optional(v.string()),
      category: v.optional(v.string()),
      context: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error('Query not found');
    }

    await ctx.db.patch(args.id, {
      metadata: args.metadata,
    });
  },
});
