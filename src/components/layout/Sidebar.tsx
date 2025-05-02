import { UserButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

export function Sidebar({
  isDarkMode,
  onThemeToggle,
}: {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}) {
  return (
    <div className='fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col shadow-sm'>
      {/* Top section */}
      <div className='mb-8'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
          RFP Response Assistant
        </h2>
      </div>

      {/* Menu items section - will be populated in the future */}
      <nav className='flex-1'>
        <ul className='space-y-2'>{/* Future menu items will go here */}</ul>
      </nav>

      {/* Bottom section with theme toggle and user profile */}
      <div className='border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto space-y-4'>
        {/* Theme toggle */}
        <motion.button
          onClick={onThemeToggle}
          className='w-full flex items-center gap-2 text-sm 
                    bg-white dark:bg-gray-800
                    text-primary-600 hover:text-primary-700 
                    dark:text-primary-400 dark:hover:text-primary-300 
                    transition-all duration-200
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    px-3 py-1.5 rounded-lg -ml-2
                    border border-gray-200 dark:border-gray-700
                    hover:border-gray-300 dark:hover:border-gray-600
                    shadow-sm hover:shadow-md
                    group'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            className='w-4 h-4 transition-transform duration-200 group-hover:scale-110'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            {isDarkMode ? (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
              />
            ) : (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
              />
            )}
          </svg>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </motion.button>

        {/* User profile */}
        <div className='flex items-center justify-between p-2'>
          <UserButton afterSignOutUrl='/' />
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            Account
          </span>
        </div>
      </div>
    </div>
  );
}
