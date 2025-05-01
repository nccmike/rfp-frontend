import { motion } from 'framer-motion';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  message?: string;
}

export const LoadingState = ({
  size = 'md',
  color = 'primary',
  message = 'Loading...',
}: LoadingStateProps) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const spinTransition = {
    loop: Infinity,
    duration: 1,
    ease: 'linear',
  };

  return (
    <div className='flex flex-col items-center justify-center space-y-4'>
      <motion.div
        className='relative'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={`${sizes[size]} border-2 border-t-transparent 
                     border-${color}-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
        <motion.div
          className={`absolute inset-0 ${sizes[size]} border-2 border-${color}-200 
                     border-r-transparent rounded-full opacity-25`}
          animate={{ rotate: -360 }}
          transition={spinTransition}
        />
      </motion.div>

      {message && (
        <motion.p
          className={`${textSizes[size]} text-gray-600 dark:text-gray-300`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};
