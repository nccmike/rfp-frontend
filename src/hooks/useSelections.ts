import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export function useSelections(userId: string) {
  // Mutations
  const saveSelection = useMutation(api.selections.saveSelection);
  const updateNotes = useMutation(api.selections.updateSelectionNotes);

  const toggleFavorite = async (
    responseId: Id<'responses'>,
    queryId: Id<'queries'>,
    isFavorite: boolean,
    notes?: string
  ) => {
    try {
      const selectionId = await saveSelection({
        userId,
        responseId,
        queryId,
        isFavorite,
        notes,
      });
      return selectionId;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const updateSelectionNotes = async (
    selectionId: Id<'selections'>,
    notes: string
  ) => {
    try {
      await updateNotes({
        id: selectionId,
        notes,
      });
    } catch (error) {
      console.error('Error updating selection notes:', error);
      throw error;
    }
  };

  // Query hooks
  const getFavorites = (limit?: number) =>
    useQuery(api.selections.getUserFavorites, { userId, limit });

  const getResponseSelections = (responseId: Id<'responses'>) =>
    useQuery(api.selections.getResponseSelections, { responseId });

  return {
    toggleFavorite,
    updateSelectionNotes,
    getFavorites,
    getResponseSelections,
  };
}
