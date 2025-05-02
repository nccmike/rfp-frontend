import { Id } from './_generated/dataModel';

export interface QueryMetadata {
  source?: string;
  category?: string;
  context?: string;
}

export interface ResponseMetadata {
  relevanceScore?: number;
  category?: string;
  tags?: string[];
}

export interface TagMetadata {
  color?: string;
  icon?: string;
}

export interface Query {
  _id: Id<'queries'>;
  text: string;
  userId: string;
  timestamp: number;
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
}

export interface Tag {
  _id: Id<'tags'>;
  name: string;
  category?: string;
  description?: string;
  metadata?: TagMetadata;
}
