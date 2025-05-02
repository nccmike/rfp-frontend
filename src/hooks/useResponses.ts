import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export interface ResponseMetadata {
  relevanceScore?: number;
  category?: string;
  tags?: string[];
}

export function useResponses() {
  // Mutations
  const saveResponse = useMutation(api.responses.saveResponse);
  const updateMetadata = useMutation(api.responses.updateResponseMetadata);

  const createResponse = async (
    queryId: Id<'queries'>,
    content: string,
    source: string,
    metadata?: ResponseMetadata
  ) => {
    try {
      const responseId = await saveResponse({
        queryId,
        content,
        source,
        metadata,
      });
      return responseId;
    } catch (error) {
      console.error('Error saving response:', error);
      throw error;
    }
  };

  const updateResponseMetadata = async (
    responseId: Id<'responses'>,
    metadata: ResponseMetadata
  ) => {
    try {
      await updateMetadata({
        id: responseId,
        metadata,
      });
    } catch (error) {
      console.error('Error updating response metadata:', error);
      throw error;
    }
  };

  // Query hooks
  const getResponsesByQuery = (queryId: Id<'queries'>) =>
    useQuery(api.responses.getResponsesByQuery, { queryId });

  const getResponseById = (responseId: Id<'responses'>) =>
    useQuery(api.responses.getResponseById, { id: responseId });

  return {
    createResponse,
    updateResponseMetadata,
    getResponsesByQuery,
    getResponseById,
  };
}
