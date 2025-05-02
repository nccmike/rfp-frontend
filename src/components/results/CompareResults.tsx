import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  Square2StackIcon as CopyIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { RFPQueryResult } from '../../services/api';
import { useSelections } from '../../hooks/useSelections';

interface CompareResultsProps {
  results: RFPQueryResult[];
  userId: string;
}

export const CompareResults = ({ results, userId }: CompareResultsProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toggleFavorite, getFavorites } = useSelections(userId);

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

  const ResultCard = ({
    result,
    index,
  }: {
    result: RFPQueryResult;
    index: number;
  }) => {
    const source = formatSource(result.source);
    const itemId = `${source.url}-${index}`;
    const isExpanded = expandedItems.has(itemId);
    const isCopied = copiedItems.has(itemId);

    return (
      <motion.div
        className='bg-white dark:bg-gray-800 rounded-xl p-6 
                   shadow-sm hover:shadow-md 
                   border border-gray-200 dark:border-gray-700
                   hover:border-gray-300 dark:hover:border-gray-600
                   transition-all duration-200'
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className='flex flex-col min-h-[24rem] relative'>
          {/* Header section */}
          <div className='flex items-start space-x-4 mb-6'>
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
              <div className='flex items-center justify-between gap-2'>
                <a
                  href={source.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm font-medium text-primary-600 hover:text-primary-700 
                           dark:text-primary-400 dark:hover:text-primary-300 
                           flex items-center gap-2 hover:underline
                           group'
                >
                  <span className='truncate'>{source.name}</span>
                  <svg
                    className='w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5'
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
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0
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
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className='flex-1 overflow-hidden'>
            <motion.div
              className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'
              animate={{ height: isExpanded ? 'auto' : '16rem' }}
              transition={{ duration: 0.3 }}
            >
              <div className='prose prose-gray dark:prose-invert max-w-none'>
                {formatContent(result.content, isExpanded)}
              </div>
            </motion.div>
          </div>

          {/* Footer section - positioned absolutely */}
          <div className='absolute bottom-0 left-0 right-0'>
            {!isExpanded && (
              <div className='h-24 bg-gradient-to-t from-white dark:from-gray-800 to-transparent' />
            )}
            <div className='bg-white dark:bg-gray-800 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700'>
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
                  onClick={() => copyToClipboard(result.content, itemId)}
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
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
      {results.slice(0, 2).map((result, index) => (
        <ResultCard key={index} result={result} index={index} />
      ))}
    </div>
  );
};
