import { SearchResult } from '../hooks/useSearchHistory';

// Mock data with predefined search results
const MOCK_DATA: Record<string, SearchResult[]> = {
  react: [
    {
      content: 'React is a JavaScript library for building user interfaces.',
      score: 0.95,
      metadata: { source: 'documentation', category: 'frontend' },
    },
    {
      content:
        'React lets you build user interfaces out of individual pieces called components.',
      score: 0.92,
      metadata: { source: 'tutorial', category: 'components' },
    },
  ],
  typescript: [
    {
      content:
        'TypeScript is a strongly typed programming language that builds on JavaScript.',
      score: 0.98,
      metadata: { source: 'documentation', category: 'language' },
    },
    {
      content:
        'TypeScript adds additional syntax to JavaScript to support a tighter integration with your editor.',
      score: 0.9,
      metadata: { source: 'guide', category: 'tooling' },
    },
  ],
  api: [
    {
      content: 'API stands for Application Programming Interface.',
      score: 0.85,
      metadata: { source: 'glossary', category: 'basics' },
    },
    {
      content:
        'RESTful APIs allow you to perform CRUD operations on resources.',
      score: 0.82,
      metadata: { source: 'tutorial', category: 'backend' },
    },
  ],
};

// Fuzzy search function to match partial queries
function fuzzySearch(query: string): SearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();

  // If we have an exact match, return it
  if (MOCK_DATA[normalizedQuery]) {
    return MOCK_DATA[normalizedQuery];
  }

  // Otherwise, search through all entries for partial matches
  const allResults: SearchResult[] = [];
  Object.entries(MOCK_DATA).forEach(([key, results]) => {
    if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
      allResults.push(...results);
    } else {
      // Search through content for matches
      results.forEach((result) => {
        if (result.content.toLowerCase().includes(normalizedQuery)) {
          allResults.push(result);
        }
      });
    }
  });

  return allResults;
}

// Simulate API delay
const MOCK_DELAY_MS = 500;

export async function mockSearch(query: string): Promise<SearchResult[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  // Simulate occasional errors
  if (Math.random() < 0.1) {
    // 10% chance of error
    throw new Error('Search service temporarily unavailable');
  }

  return fuzzySearch(query);
}
