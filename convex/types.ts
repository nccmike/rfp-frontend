import { Id } from './_generated/dataModel';

export interface QueryMetadata {
  source?: string;
  category?: string;
  context?: string;
  effectivenessScore?: number;
  searchCount?: number;
  lastUsed?: number;
}

export interface ResponseMetadata {
  relevanceScore?: number;
  category?: string;
  tags?: string[];
  qualityScore?: number;
  useCount?: number;
  lastUsed?: number;
}

export interface TagMetadata {
  color?: string;
  icon?: string;
}

export interface SelectionFeedback {
  relevanceScore?: number;
  usefulness?: number;
  modificationRequired?: boolean;
  contextAccuracy?: number;
}

export interface QueryRelationshipMetadata {
  lastUsed: number;
  userFeedback?: number;
  matchType: 'semantic' | 'keyword' | 'user-selected';
}

export interface Query {
  _id: Id<'queries'>;
  text: string;
  userId: string;
  timestamp: number;
  embedding?: number[];
  metadata?: QueryMetadata;
}

export interface Response {
  _id: Id<'responses'>;
  queryId: Id<'queries'>;
  content: string;
  source: string;
  timestamp: number;
  metadata?: ResponseMetadata;
}

export interface Selection {
  _id: Id<'selections'>;
  userId: string;
  responseId: Id<'responses'>;
  queryId: Id<'queries'>;
  timestamp: number;
  isFavorite: boolean;
  notes?: string;
  feedback?: SelectionFeedback;
}

export interface QueryRelationship {
  _id: Id<'queryRelationships'>;
  sourceQueryId: Id<'queries'>;
  relatedQueryId: Id<'queries'>;
  responseId: Id<'responses'>;
  similarityScore: number;
  useCount: number;
  successRate: number;
  metadata: QueryRelationshipMetadata;
}

export interface Tag {
  _id: Id<'tags'>;
  name: string;
  category?: string;
  description?: string;
  metadata?: TagMetadata;
}
