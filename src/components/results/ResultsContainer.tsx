import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RFPQueryResult } from '../../services/api';
import { ResultsList } from './ResultsList';
import { CompareResults } from './CompareResults';
import { FavoriteResults } from './FavoriteResults';

type ViewMode = 'list' | 'compare' | 'favorites';

interface ResultsContainerProps {
  results: RFPQueryResult[];
  isLoading: boolean;
  userId: string;
}

export const ResultsContainer = ({
  results,
  isLoading,
  userId,
}: ResultsContainerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedResults, setSelectedResults] = useState<RFPQueryResult[]>([]);

  const handleResultSelect = (result: RFPQueryResult) => {
    setSelectedResults((prev) => {
      const isSelected = prev.some((r) => r.source === result.source);
      if (isSelected) {
        return prev.filter((r) => r.source !== result.source);
      }
      if (prev.length < 2) {
        return [...prev, result];
      }
      return [prev[1], result]; // Replace oldest selection
    });
  };

  return (
    <div className='space-y-6'>
      {/* View Mode Toggle */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setViewMode('list')}
            className={`btn-base ${
              viewMode === 'list'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800'
                : ''
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setViewMode('compare')}
            disabled={selectedResults.length < 2}
            className={`btn-base ${
              viewMode === 'compare'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800'
                : selectedResults.length < 2
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
            }`}
          >
            Compare ({selectedResults.length}/2)
          </button>
          <button
            onClick={() => setViewMode('favorites')}
            className={`btn-base ${
              viewMode === 'favorites'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800'
                : ''
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Results View */}
      <AnimatePresence mode='wait'>
        {viewMode === 'list' && (
          <motion.div
            key='list'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ResultsList
              results={results}
              isLoading={isLoading}
              onSelect={handleResultSelect}
              selectedResults={selectedResults}
              userId={userId}
            />
          </motion.div>
        )}

        {viewMode === 'compare' && selectedResults.length === 2 && (
          <motion.div
            key='compare'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CompareResults results={selectedResults} userId={userId} />
          </motion.div>
        )}

        {viewMode === 'favorites' && (
          <motion.div
            key='favorites'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FavoriteResults userId={userId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
