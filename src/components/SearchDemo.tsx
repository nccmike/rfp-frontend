import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchResult } from '../hooks/useSearchHistory';
import { mockSearch } from '../services/mockSearchService';

export function SearchDemo() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return [];

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await mockSearch(query);
      setResults(searchResults);
      return searchResults;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setResults([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Search Demo</h1>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Try searching for 'react', 'typescript', or 'api'..."
      />

      {error && (
        <div className='mt-4 p-4 bg-red-100 text-red-700 rounded-md'>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className='mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Results:</h2>
          <div className='space-y-4'>
            {results.map((result, index) => (
              <div key={index} className='p-4 bg-white shadow rounded-md'>
                <div className='text-gray-800'>{result.content}</div>
                <div className='mt-2 text-sm text-gray-500'>
                  Score: {result.score?.toFixed(2)}
                  {result.metadata && (
                    <span className='ml-2'>
                      • {result.metadata.source} • {result.metadata.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!error && results.length === 0 && !isLoading && (
        <div className='mt-4 text-gray-500 text-center'>
          No results found. Try a different search term.
        </div>
      )}
    </div>
  );
}
