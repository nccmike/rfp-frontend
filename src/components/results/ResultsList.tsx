import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  Square2StackIcon as CopyIcon,
  CheckIcon,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { RFPQueryResult } from '../../services/api';
import { useState } from 'react';
import { useSelections } from '../../hooks/useSelections';

interface ResultsListProps {
  results: RFPQueryResult[];
  isLoading: boolean;
  onSelect?: (result: RFPQueryResult) => void;
  selectedResults?: RFPQueryResult[];
  userId: string;
}

export const ResultsList = ({
  results,
  isLoading,
  onSelect,
  selectedResults = [],
  userId,
}: ResultsListProps) => {
  const [parent] = useAutoAnimate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toggleFavorite, getFavorites } = useSelections(userId);

  const favorites = getFavorites();
  const favoriteIds = new Set(favorites?.map((f) => f.response._id) || []);

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

  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
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

  const formatContent = (content: string, isExpanded: boolean) => {
    // Parse markdown-like syntax
    const formattedContent = content
      // Remove XML-like tags
      .replace(/<\/?figure(?:_type)?>/g, '')
      .replace(/<\/?ICON>/g, '')
      // Format headers
      .replace(
        /#{1,6}\s(.+)/g,
        (match, title) =>
          `<h${
            match.match(/#/g)?.length || 1
          } class="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">${title}</h${
            match.match(/#/g)?.length || 1
          }>`
      )
      // Format titles
      .replace(
        /Title:\s(.+)/g,
        '<strong class="block text-gray-800 dark:text-gray-200 mb-2">$1</strong>'
      )
      // Add paragraph spacing
      .split('\n')
      .filter((line) => line.trim())
      .join('</p><p class="mb-2">');

    return (
      <div
        className='prose prose-gray dark:prose-invert max-w-none'
        dangerouslySetInnerHTML={{
          __html: `<p class="mb-2">${formattedContent}</p>`,
        }}
      />
    );
  };

  const copyToClipboard = async (content: string, itemId: string) => {
    try {
      // Strip HTML tags and decode entities for clean text
      const cleanContent = content
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .replace(/&amp;/g, '&') // Replace &amp; with &
        .replace(/&lt;/g, '<') // Replace &lt; with <
        .replace(/&gt;/g, '>'); // Replace &gt; with >

      await navigator.clipboard.writeText(cleanContent);

      // Show copied state
      setCopiedItems((prev) => {
        const newSet = new Set(prev);
        newSet.add(itemId);
        return newSet;
      });

      // Reset copied state after 2 seconds
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

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'
        >
          <div className='animate-pulse flex space-x-4'>
            <div className='flex-1 space-y-4 py-1'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
              <div className='space-y-2'>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded'></div>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6'></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );

  const isSelected = (result: RFPQueryResult) =>
    selectedResults.some((r) => r.source === result.source);

  return (
    <div ref={parent} className='mt-8 space-y-4'>
      <AnimatePresence mode='wait'>
        {isLoading ? (
          <LoadingSkeleton />
        ) : results.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='show'
            className='space-y-4'
          >
            {results.map((result, index) => {
              const source = formatSource(result.source);
              const itemId = `${source.url}-${index}`;
              const isExpanded = expandedItems.has(itemId);
              const isCopied = copiedItems.has(itemId);
              const resultSelected = isSelected(result);
              const isFavorite = favoriteIds.has(result._id);

              return (
                <motion.div
                  key={itemId}
                  variants={itemVariants}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 
                           shadow-sm hover:shadow-md 
                           border ${
                             resultSelected
                               ? 'border-primary-300 dark:border-primary-600 ring-1 ring-primary-500/30'
                               : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                           }
                           transition-all duration-200`}
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
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium
                                      ${
                                        result.score >= 0.8
                                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-400 dark:border-green-800'
                                          : result.score >= 0.6
                                            ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:text-yellow-400 dark:border-yellow-800'
                                            : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200 dark:from-gray-700 dark:to-gray-600 dark:text-gray-400 dark:border-gray-600'
                                      }`}
                            >
                              Score: {Math.round(result.score * 100)}%
                            </span>
                            <button
                              onClick={() => {
                                const content = formatContent(
                                  result.content,
                                  true
                                ).props.dangerouslySetInnerHTML.__html;
                                copyToClipboard(content, itemId);
                              }}
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
                          {formatContent(result.content, isExpanded)}
                        </div>
                      </motion.div>
                      <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
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

                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() =>
                              toggleFavorite(
                                result._id,
                                result.queryId,
                                !isFavorite
                              )
                            }
                            className={`btn-icon ${
                              isFavorite
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700'
                                : ''
                            }`}
                            title={
                              isFavorite
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                            }
                          >
                            {isFavorite ? (
                              <HeartIconSolid className='h-5 w-5' />
                            ) : (
                              <HeartIconOutline className='h-5 w-5' />
                            )}
                          </button>

                          {onSelect && (
                            <button
                              onClick={() => onSelect(result)}
                              className={`btn-base ${
                                resultSelected
                                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800'
                                  : ''
                              }`}
                            >
                              {resultSelected
                                ? 'Selected'
                                : 'Select for Compare'}
                            </button>
                          )}

                          <button
                            onClick={() =>
                              copyToClipboard(result.content, itemId)
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
            No results found. Try adjusting your search query.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
