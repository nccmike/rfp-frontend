import React from 'react';
import { useQueryRelationships } from '../hooks/useQueryRelationships';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';

interface SimilarQueriesProps {
  currentQuery: string;
  onSelectResponse: (response: string) => void;
}

export function SimilarQueries({
  currentQuery,
  onSelectResponse,
}: SimilarQueriesProps) {
  const { findSimilarQueries } = useQueryRelationships();
  const { theme } = useTheme();
  const similarResults = findSimilarQueries(currentQuery);

  if (similarResults.length === 0) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Similar Queries</h3>
      <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
        {similarResults.map((result) => (
          <Card
            key={result.relationship._id}
            className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className='flex justify-between items-start mb-2'>
              <div>
                <p className='font-medium'>{result.query?.text}</p>
                <div className='flex gap-2 mt-1'>
                  <Badge variant='secondary'>
                    Score:{' '}
                    {Math.round(result.relationship.similarityScore * 100)}%
                  </Badge>
                  <Badge variant='outline'>
                    Used: {result.relationship.useCount} times
                  </Badge>
                  <Badge
                    variant={
                      result.relationship.successRate > 0.8
                        ? 'success'
                        : result.relationship.successRate > 0.5
                          ? 'warning'
                          : 'destructive'
                    }
                  >
                    Success: {Math.round(result.relationship.successRate * 100)}
                    %
                  </Badge>
                </div>
              </div>
            </div>

            {result.response && (
              <div className='mt-4'>
                <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                  {result.response.content.length > 200
                    ? `${result.response.content.slice(0, 200)}...`
                    : result.response.content}
                </p>
                <div className='flex justify-between items-center mt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onSelectResponse(result.response!.content)}
                  >
                    Use This Response
                  </Button>
                  <span className='text-xs text-gray-500'>
                    Source: {result.response.source}
                  </span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
