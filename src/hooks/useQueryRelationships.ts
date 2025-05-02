import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Query, Response, QueryRelationship } from '../../convex/types';

export interface UseQueryRelationshipsProps {
  threshold?: number;
}

export interface SimilarQueryResult {
  relationship: QueryRelationship;
  query: Query | null;
  response: Response | null;
}

export interface TopQueryResponsePair {
  relationship: QueryRelationship;
  sourceQuery: Query | null;
  relatedQuery: Query | null;
  response: Response | null;
}

export function useQueryRelationships({
  threshold = 0.7,
}: UseQueryRelationshipsProps = {}) {
  const findSimilarQuery = useQuery(api.queryRelationships.findSimilarQueries, {
    queryText: '',
    threshold,
  });
  const upsertRelationship = useMutation(
    api.queryRelationships.upsertQueryRelationship
  );
  const getTopPairsQuery = useQuery(
    api.queryRelationships.getTopQueryResponsePairs,
    { limit: 10 }
  );

  const findSimilarQueries = (queryText: string): SimilarQueryResult[] => {
    try {
      return findSimilarQuery!({
        queryText,
        threshold,
      }) as SimilarQueryResult[];
    } catch {
      return [];
    }
  };

  const saveQueryRelationship = (
    sourceQueryId: Id<'queries'>,
    relatedQueryId: Id<'queries'>,
    responseId: Id<'responses'>,
    {
      similarityScore,
      wasSuccessful,
      matchType,
    }: {
      similarityScore: number;
      wasSuccessful: boolean;
      matchType: 'semantic' | 'keyword' | 'user-selected';
    }
  ) => {
    if (!upsertRelationship) return Promise.resolve(undefined);

    return upsertRelationship({
      sourceQueryId,
      relatedQueryId,
      responseId,
      similarityScore,
      wasSuccessful,
      matchType,
    });
  };

  const getTopQueryResponsePairs = (
    limit: number = 10
  ): TopQueryResponsePair[] => {
    try {
      return getTopPairsQuery!({ limit }) as TopQueryResponsePair[];
    } catch {
      return [];
    }
  };

  return {
    findSimilarQueries,
    saveQueryRelationship,
    getTopQueryResponsePairs,
  };
}
