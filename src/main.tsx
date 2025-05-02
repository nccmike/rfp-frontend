import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

const appearance = {
  layout: {
    socialButtonsPlacement: 'bottom' as const,
    showOptionalFields: false,
  },
  elements: {
    card: 'bg-white dark:bg-gray-800 shadow-xl',
    headerTitle: 'text-gray-900 dark:text-white',
    headerSubtitle: 'text-gray-600 dark:text-gray-300',
    formFieldLabel: 'text-gray-700 dark:text-gray-200',
    formFieldInput:
      'block w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500',
    formButtonPrimary:
      'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded',
    dividerText: 'text-gray-600 dark:text-gray-400',
    footer: 'hidden',
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={appearance}
      afterSignInUrl='/'
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>
);
