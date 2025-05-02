import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { AppLayout } from './components/layout/AppLayout';
import { SearchBar } from './components/SearchBar';
import { ResultsContainer } from './components/results/ResultsContainer';
import { RFPQueryResult } from './services/api';
import { searchMockRFP } from './services/mockData';

export default function App() {
  const { user } = useUser();
  const [results, setResults] = useState<RFPQueryResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await searchMockRFP(query);
      setResults(searchResults);
      return searchResults;
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className='max-w-4xl mx-auto'>
        <SearchBar
          onSearch={handleSearch}
          placeholder='Search RFP responses...'
          className='mb-4'
        />

        {error && (
          <div className='mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800'>
            <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
          </div>
        )}

        <ResultsContainer
          results={results}
          isLoading={isLoading}
          userId={user?.id || ''}
        />
      </div>
    </AppLayout>
  );
}
