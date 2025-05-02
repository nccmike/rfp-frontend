import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

// Save a user selection/favorite
export const saveSelection = mutation({
  args: {
    userId: v.string(),
    responseId: v.id('responses'),
    queryId: v.id('queries'),
    isFavorite: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify the response and query exist
    const response = await ctx.db.get(args.responseId);
    const query = await ctx.db.get(args.queryId);
    if (!response || !query) {
      throw new Error('Response or query not found');
    }

    // Check if selection already exists
    const existing = await ctx.db
      .query('selections')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('responseId'), args.responseId))
      .first();

    if (existing) {
      // Update existing selection
      await ctx.db.patch(existing._id, {
        isFavorite: args.isFavorite,
        notes: args.notes,
        timestamp: Date.now(),
      });
      return existing._id;
    }

    // Create new selection
    const selectionId = await ctx.db.insert('selections', {
      userId: args.userId,
      responseId: args.responseId,
      queryId: args.queryId,
      isFavorite: args.isFavorite,
      notes: args.notes,
      timestamp: Date.now(),
    });
    return selectionId;
  },
});

// Get user's favorites
export const getUserFavorites = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const selections = await ctx.db
      .query('selections')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isFavorite'), true))
      .order('desc')
      .take(limit);

    // Fetch associated responses and queries
    const results = await Promise.all(
      selections.map(async (selection) => {
        const response = await ctx.db.get(selection.responseId);
        const query = await ctx.db.get(selection.queryId);
        return {
          selection,
          response,
          query,
        };
      })
    );

    return results;
  },
});

// Get selections for a specific response
export const getResponseSelections = query({
  args: {
    responseId: v.id('responses'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('selections')
      .withIndex('by_response', (q) => q.eq('responseId', args.responseId))
      .collect();
  },
});

// Update selection notes
export const updateSelectionNotes = mutation({
  args: {
    id: v.id('selections'),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error('Selection not found');
    }

    await ctx.db.patch(args.id, {
      notes: args.notes,
      timestamp: Date.now(),
    });
  },
});
