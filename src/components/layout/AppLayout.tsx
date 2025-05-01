import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col'>
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='py-8 flex justify-between items-center'
        >
          <div>
            <motion.h1
              className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-primary-600 dark:from-white dark:to-primary-400 mb-2 text-left'
              layoutId='page-title'
            >
              RFP Response Assistant
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='text-lg text-gray-600 dark:text-gray-300 text-left'
            >
              Find relevant information from previous RFP responses
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className='p-2.5 rounded-xl bg-white dark:bg-gray-800 
                     shadow-sm hover:shadow-md
                     border border-gray-200 dark:border-gray-700
                     hover:border-gray-300 dark:hover:border-gray-600 
                     transition-all duration-200'
            aria-label={
              isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            {isDarkMode ? (
              <SunIcon className='h-5 w-5 text-amber-500' />
            ) : (
              <MoonIcon className='h-5 w-5 text-gray-500 hover:text-gray-700' />
            )}
          </motion.button>
        </motion.header>

        <AnimatePresence mode='wait'>
          <motion.main
            key='main-content'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='flex-1 w-full max-w-5xl mx-auto'
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 text-left'
        >
          <p>Powered by AWS Bedrock</p>
        </motion.footer>
      </div>
    </div>
  );
};
