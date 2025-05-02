import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export interface QueryMetadata {
  source?: string;
  category?: string;
  context?: string;
}

export function useQueries(userId: string) {
  // Mutations
  const saveQuery = useMutation(api.queries.saveQuery);
  const updateMetadata = useMutation(api.queries.updateQueryMetadata);

  // Queries
  const queryHistory = useQuery(api.queries.getQueryHistory, {
    userId,
    limit: 50,
  });

  const createQuery = async (text: string, metadata?: QueryMetadata) => {
    try {
      const queryId = await saveQuery({
        text,
        userId,
        metadata,
      });
      return queryId;
    } catch (error) {
      console.error('Error saving query:', error);
      throw error;
    }
  };

  const updateQueryMetadata = async (
    queryId: Id<'queries'>,
    metadata: QueryMetadata
  ) => {
    try {
      await updateMetadata({
        id: queryId,
        metadata,
      });
    } catch (error) {
      console.error('Error updating query metadata:', error);
      throw error;
    }
  };

  const getQueryById = (queryId: Id<'queries'>) =>
    useQuery(api.queries.getQueryById, { id: queryId });

  return {
    queryHistory,
    createQuery,
    updateQueryMetadata,
    getQueryById,
  };
}
