import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { SearchInput } from './components/search/SearchInput';
import { ResultsList } from './components/results/ResultsList';
import { searchRFP, RFPQueryResult, APIError } from './services/api';
import { SignInButton } from '@clerk/clerk-react';
import { Authenticated, Unauthenticated } from 'convex/react';

function AuthenticatedApp() {
  const [searchResults, setSearchResults] = useState<RFPQueryResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Initiating search with query:', query);
      const results = await searchRFP(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error details:', {
        error: err,
        type: err instanceof Error ? 'Error' : typeof err,
        apiError: err as APIError,
      });

      let errorMessage = 'An unexpected error occurred';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if ((err as APIError)?.message) {
        const apiError = err as APIError;
        errorMessage = `${apiError.message} (Code: ${apiError.code})`;

        if (apiError.details) {
          console.error('API Error Details:', apiError.details);
        }
      }

      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className='space-y-8'>
        <SearchInput onSearch={handleSearch} isLoading={isLoading} />
        {error && (
          <div className='rounded-lg bg-red-50 dark:bg-red-900/10 p-4 text-red-600 dark:text-red-400'>
            <p className='text-sm font-medium'>{error}</p>
            <p className='text-xs mt-1'>
              Please try again or contact support if the issue persists.
            </p>
          </div>
        )}
        <ResultsList results={searchResults} isLoading={isLoading} />
      </div>
    </AppLayout>
  );
}

function App() {
  return (
    <>
      <Authenticated>
        <AuthenticatedApp />
      </Authenticated>
      <Unauthenticated>
        <AppLayout>
          <div className='flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))]'>
            <h1 className='text-2xl font-bold mb-4'>Welcome to RFP Search</h1>
            <p className='mb-8 text-gray-600 dark:text-gray-300'>
              Please sign in with your credentials
            </p>
            <SignInButton mode='modal'>
              <button className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded'>
                Sign In
              </button>
            </SignInButton>
          </div>
        </AppLayout>
      </Unauthenticated>
    </>
  );
}

export default App;
