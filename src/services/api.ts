import axios from 'axios';
import { generateMockResults } from '../mocks/rfpData';

// Types
export interface RFPQueryResult {
  content: string;
  source: string;
  score: number;
}

export interface RFPSearchResponse {
  statusCode: number;
  query: string;
  query_results: RFPQueryResult[];
}

export interface APIError {
  message: string;
  code: string;
  details?: unknown;
}

// Environment configuration
const USE_MOCK_DATA =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === 'true';
const API_DELAY = import.meta.env.DEV ? 1000 : 0; // Add 1s delay in development to simulate network

// API Configuration
const api = axios.create({
  // Use proxy in development, direct URL in production
  baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error: unknown): never => {
  // Log the raw error first
  console.error('Raw Error:', error);

  if (axios.isAxiosError(error)) {
    // Special handling for CORS errors
    if (
      error.message.includes('Network Error') ||
      error.response?.status === 0
    ) {
      console.error('CORS Error Details:', {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
      });

      throw {
        message:
          'Unable to access the API due to CORS restrictions. Please ensure the API is configured to accept requests from this origin.',
        code: 'CORS_ERROR',
        details: {
          origin: window.location.origin,
          targetUrl: error.config?.url,
          originalError: error.message,
        },
      } as APIError;
    }

    console.error('Axios Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data,
      responseData: error.response?.data,
      stack: error.stack,
    });

    // Network error (no response received)
    if (!error.response) {
      throw {
        message: 'Network error - Unable to reach the server',
        code: 'NETWORK_ERROR',
        details: {
          originalError: error.message,
          config: error.config,
        },
      } as APIError;
    }

    // Server returned an error response
    const apiError: APIError = {
      message:
        error.response.data?.message ||
        error.message ||
        'Server error occurred',
      code: error.response.status?.toString() || 'SERVER_ERROR',
      details: {
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      },
    };
    throw apiError;
  }

  // Handle non-Axios errors
  console.error('Non-Axios Error Details:', {
    type: typeof error,
    isError: error instanceof Error,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  throw {
    message:
      error instanceof Error
        ? error.message
        : 'An unexpected application error occurred',
    code: 'APP_ERROR',
    details: error,
  } as APIError;
};

// Mock API delay
const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API Methods
export const searchRFP = async (query: string): Promise<RFPQueryResult[]> => {
  if (!query.trim()) {
    throw {
      message: 'Search query cannot be empty',
      code: 'VALIDATION_ERROR',
      details: { query },
    } as APIError;
  }

  try {
    // Use mock data in development if enabled
    if (USE_MOCK_DATA) {
      console.log('Using mock data for search:', { query });
      await mockDelay(API_DELAY);
      return generateMockResults(query);
    }

    console.log('Sending search request:', {
      url: '/getResponsesWithTitanEmbeddings',
      data: { user_query: query },
    });

    const response = await api.post<RFPSearchResponse>(
      '/getResponsesWithTitanEmbeddings',
      { user_query: query },
      {
        timeout: 30000, // 30 second timeout
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Search response received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    if (!response.data?.query_results) {
      throw {
        message: 'Invalid response format from server',
        code: 'INVALID_RESPONSE',
        details: response.data,
      } as APIError;
    }

    return response.data.query_results;
  } catch (error) {
    return handleError(error);
  }
};

// Response interceptor for common error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

// Add documentation about CORS requirements
/**
 * API Configuration Notes:
 *
 * CORS Requirements:
 * The API server must be configured to accept requests from the following origins:
 * - Development: http://localhost:3000
 * - Production: [Add your production domain here]
 *
 * Required CORS headers on the server:
 * - Access-Control-Allow-Origin: [origins listed above]
 * - Access-Control-Allow-Methods: POST, OPTIONS
 * - Access-Control-Allow-Headers: Content-Type, Accept, Origin
 */

export default api;
