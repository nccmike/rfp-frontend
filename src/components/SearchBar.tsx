import React, { useState, useCallback } from 'react';
import { useSearchHistory, SearchResult } from '../hooks/useSearchHistory';
import { SearchHistoryDropdown } from './SearchHistoryDropdown';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Props {
  onSearch: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  className = '',
}: Props) {
  const [query, setQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const controls = useAnimation();
  const {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    findCachedResults,
  } = useSearchHistory();

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      setIsLoading(true);
      try {
        // Check cache first
        const cachedResults = findCachedResults(searchQuery);
        if (cachedResults) {
          setIsLoading(false);
          return cachedResults;
        }

        // If not in cache, perform the search
        const results = await onSearch(searchQuery);

        // Add to history only if we got results
        if (results && results.length > 0) {
          addToHistory(searchQuery, results);
        }

        return results;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch, addToHistory, findCachedResults]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const handleHistorySelect = async (selectedQuery: string) => {
    setQuery(selectedQuery);
    setIsDropdownVisible(false);
    try {
      await performSearch(selectedQuery);
    } catch (error) {
      // Handle error if needed
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        setIsDropdownVisible(false);
        await performSearch(query);
      } catch (error) {
        // Handle error if needed
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.form
        onSubmit={handleSubmit}
        className='relative'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className='relative'
          animate={controls}
          style={{ width: '100%', margin: '0 auto' }}
        >
          <motion.div
            className={`relative rounded-2xl bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700
                       transition-all duration-200
                       ${
                         isFocused
                           ? 'shadow-lg border-primary-300 dark:border-primary-500 ring-1 ring-primary-500/30'
                           : 'shadow-sm hover:border-gray-300 dark:hover:border-gray-600'
                       }`}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <input
              type='text'
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                setIsDropdownVisible(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                // Give more time and wrap in requestAnimationFrame to prevent race conditions
                requestAnimationFrame(() => {
                  setTimeout(() => {
                    setIsDropdownVisible(false);
                  }, 500);
                });
              }}
              placeholder={placeholder}
              className='w-full px-12 py-4 text-lg bg-transparent border-none rounded-2xl 
                       text-gray-900 dark:text-white placeholder-gray-400 
                       focus:outline-none focus:ring-0'
              disabled={isLoading}
            />

            <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
              <MagnifyingGlassIcon
                className={`h-5 w-5 transition-colors duration-200 ${
                  isFocused
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-400'
                }`}
              />
            </div>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='absolute inset-y-0 right-4 flex items-center'
                >
                  <motion.div
                    className='h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full'
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='mt-3 text-center text-sm text-gray-500 dark:text-gray-400'
        >
          Press Enter to search through previous RFP responses
        </motion.div>
      </motion.form>

      <SearchHistoryDropdown
        history={searchHistory}
        onSelect={handleHistorySelect}
        onRemove={removeFromHistory}
        onClear={clearHistory}
        visible={isDropdownVisible}
      />
    </div>
  );
}
