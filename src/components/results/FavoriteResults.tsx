import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  Square2StackIcon as CopyIcon,
  CheckIcon,
  HeartIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useSelections } from '../../hooks/useSelections';

interface FavoriteResultsProps {
  userId: string;
}

export const FavoriteResults = ({ userId }: FavoriteResultsProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toggleFavorite, getFavorites, updateSelectionNotes } =
    useSelections(userId);

  const favorites = getFavorites();

  const formatSource = (source: string) => {
    try {
      const url = new URL(source);
      const filename = url.pathname.split('/').pop() || '';
      return {
        name: filename.replace('.pdf', '').replace(/%20/g, ' '),
        url: source,
      };
    } catch {
      return { name: source, url: source };
    }
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (content: string, itemId: string) => {
    try {
      const cleanContent = content
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      await navigator.clipboard.writeText(cleanContent);
      setCopiedItems((prev) => new Set(prev).add(itemId));
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence mode='wait'>
      {favorites?.length ? (
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='show'
          className='space-y-4'
        >
          {favorites.map(({ selection, response, query }, index) => {
            const source = formatSource(response.source);
            const itemId = `${source.url}-${index}`;
            const isExpanded = expandedItems.has(itemId);
            const isCopied = copiedItems.has(itemId);

            return (
              <motion.div
                key={itemId}
                variants={itemVariants}
                className='bg-white dark:bg-gray-800 rounded-xl p-6 
                         shadow-sm hover:shadow-md 
                         border border-gray-200 dark:border-gray-700
                         hover:border-gray-300 dark:hover:border-gray-600
                         transition-all duration-200'
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              >
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0'>
                    <div
                      className='p-2.5 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 
                                border border-primary-100 dark:border-primary-800
                                shadow-sm rounded-xl'
                    >
                      <DocumentTextIcon className='h-6 w-6 text-primary-500 dark:text-primary-400' />
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4'>
                      <div className='flex items-center gap-3 flex-wrap'>
                        <a
                          href={source.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm font-medium text-primary-600 hover:text-primary-700 
                                   dark:text-primary-400 dark:hover:text-primary-300 
                                   flex items-center gap-2 hover:underline
                                   group'
                        >
                          <span>{source.name}</span>
                          <svg
                            className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                            />
                          </svg>
                        </a>
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() =>
                              toggleFavorite(response._id, query._id, false)
                            }
                            className='btn-icon bg-red-50 dark:bg-red-900/20 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700'
                            title='Remove from favorites'
                          >
                            <HeartIcon className='h-5 w-5' />
                          </button>
                          <button
                            onClick={() =>
                              copyToClipboard(response.content, itemId)
                            }
                            className='btn-icon'
                            title={isCopied ? 'Copied!' : 'Copy to clipboard'}
                          >
                            {isCopied ? (
                              <CheckIcon className='h-5 w-5 text-primary-600 dark:text-primary-400' />
                            ) : (
                              <CopyIcon className='h-5 w-5 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300' />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                      <span className='font-medium'>Original Query:</span>{' '}
                      {query.text}
                    </div>

                    <motion.div
                      className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'
                      animate={{ height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`prose prose-gray dark:prose-invert max-w-none ${
                          !isExpanded ? 'line-clamp-3 overflow-hidden' : ''
                        }`}
                      >
                        {response.content}
                      </div>
                    </motion.div>

                    {selection.notes && (
                      <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700'>
                        <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                          Notes
                        </h4>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                          {selection.notes}
                        </p>
                      </div>
                    )}

                    <motion.button
                      onClick={() => toggleExpand(itemId)}
                      className='btn-base group'
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUpIcon className='h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5' />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDownIcon className='h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5' />
                          Show more
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='text-center text-gray-500 dark:text-gray-400 py-8'
        >
          No favorites yet. Save some responses to see them here.
        </motion.div>
      )}
    </AnimatePresence>
  );
};
