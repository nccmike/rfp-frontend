import React from 'react';
import { SearchHistoryItem } from '../hooks/useSearchHistory';
import { motion } from 'framer-motion';

interface Props {
  history: SearchHistoryItem[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onClear: () => void;
  visible: boolean;
}

export function SearchHistoryDropdown({
  history,
  onSelect,
  onRemove,
  onClear,
  visible,
}: Props) {
  if (!visible || history.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className='absolute w-full bg-white dark:bg-gray-800 rounded-xl p-6 
                 shadow-sm hover:shadow-md 
                 border border-gray-200 dark:border-gray-700
                 hover:border-gray-300 dark:hover:border-gray-600
                 transition-all duration-200 mt-2 overflow-hidden z-50'
    >
      <div className='flex justify-between items-center'>
        <span className='text-sm text-gray-700 dark:text-gray-300'>
          Recent Searches ({history.length})
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            onClear();
          }}
          className='btn-base text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
        >
          Clear All
        </button>
      </div>
      <div className='max-h-[24rem] overflow-y-auto mt-4'>
        <ul className='space-y-2'>
          {history.map((item) => (
            <li
              key={item.timestamp}
              className='border-t border-gray-100 dark:border-gray-700 first:border-0'
            >
              <button
                className='btn-base w-full text-left'
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(item.query);
                }}
              >
                <div className='text-gray-900 dark:text-white'>
                  {item.query}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-2'>
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{item.results.length} results</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
