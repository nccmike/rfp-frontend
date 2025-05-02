import { v } from 'convex/values';
import { mutation, query, action } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { QueryRelationship } from './types';

// Find similar queries based on text similarity and past relationships
export const findSimilarQueries = query({
  args: {
    queryText: v.string(),
    threshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const threshold = args.threshold ?? 0.7; // Default similarity threshold

    // First, search for similar queries using text search
    const similarQueries = await ctx.db
      .query('queries')
      .withSearchIndex('by_text', (q) => q.search('text', args.queryText))
      .collect();

    // Get successful relationships for these queries
    const relationships = await Promise.all(
      similarQueries.map(async (query) => {
        return ctx.db
          .query('queryRelationships')
          .withIndex('by_source_query')
          .filter((q) => q.eq(q.field('sourceQueryId'), query._id))
          .filter((q) => q.gte(q.field('successRate'), threshold))
          .collect();
      })
    );

    // Combine and sort results
    const results = await Promise.all(
      relationships.flat().map(async (rel) => {
        const relatedQuery = await ctx.db.get(rel.relatedQueryId);
        const response = await ctx.db.get(rel.responseId);
        return {
          relationship: rel,
          query: relatedQuery,
          response,
        };
      })
    );

    return results.sort(
      (a, b) =>
        b.relationship.successRate * b.relationship.useCount -
        a.relationship.successRate * a.relationship.useCount
    );
  },
});

// Save or update a query relationship
export const upsertQueryRelationship = mutation({
  args: {
    sourceQueryId: v.id('queries'),
    relatedQueryId: v.id('queries'),
    responseId: v.id('responses'),
    similarityScore: v.number(),
    wasSuccessful: v.boolean(),
    matchType: v.string(),
  },
  handler: async (ctx, args) => {
    // Check for existing relationship
    const existing = await ctx.db
      .query('queryRelationships')
      .withIndex('by_source_query')
      .filter((q) => q.eq(q.field('sourceQueryId'), args.sourceQueryId))
      .filter((q) => q.eq(q.field('relatedQueryId'), args.relatedQueryId))
      .first();

    if (existing) {
      // Update existing relationship
      const newSuccessRate =
        (existing.successRate * existing.useCount +
          (args.wasSuccessful ? 1 : 0)) /
        (existing.useCount + 1);

      return ctx.db.patch(existing._id, {
        useCount: existing.useCount + 1,
        successRate: newSuccessRate,
        metadata: {
          ...existing.metadata,
          lastUsed: Date.now(),
          userFeedback: args.wasSuccessful ? 1 : 0,
        },
      });
    } else {
      // Create new relationship
      return ctx.db.insert('queryRelationships', {
        sourceQueryId: args.sourceQueryId,
        relatedQueryId: args.relatedQueryId,
        responseId: args.responseId,
        similarityScore: args.similarityScore,
        useCount: 1,
        successRate: args.wasSuccessful ? 1 : 0,
        metadata: {
          lastUsed: Date.now(),
          matchType: args.matchType,
        },
      });
    }
  },
});

// Get top performing query-response pairs
export const getTopQueryResponsePairs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const topRelationships = await ctx.db
      .query('queryRelationships')
      .withIndex('by_success')
      .order('desc')
      .take(limit);

    return Promise.all(
      topRelationships.map(async (rel) => {
        const sourceQuery = await ctx.db.get(rel.sourceQueryId);
        const relatedQuery = await ctx.db.get(rel.relatedQueryId);
        const response = await ctx.db.get(rel.responseId);

        return {
          relationship: rel,
          sourceQuery,
          relatedQuery,
          response,
        };
      })
    );
  },
});
