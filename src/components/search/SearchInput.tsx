import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchInput = ({
  onSearch,
  isLoading = false,
}: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();
  const [parent] = useAutoAnimate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  // Animate the input field width on focus
  useEffect(() => {
    controls.start({
      width: isFocused ? '100%' : '80%',
      transition: { duration: 0.3, ease: 'easeInOut' },
    });
  }, [isFocused, controls]);

  return (
    <div ref={parent} className='w-full'>
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
              ref={inputRef}
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder='Enter your RFP question or context...'
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
    </div>
  );
};
