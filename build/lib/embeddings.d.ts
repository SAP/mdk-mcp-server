// Type definitions for ./lib/embeddings.js

/**
 * Generates embeddings for an array of texts.
 * @param id Id of embedding vectors.
 * @param texts Array of input strings to embed.
 * @returns Promise that resolves when embeddings are created and saved
 */
export function createEmbeddings(id: string, texts: string[]): Promise<void>;

export function loadChunks(id: string, dir?: string): Promise<string[]>;

export interface SearchResult {
  content: string;
  similarity: number;
}

export function searchEmbeddings(query: string, chunks: string[]): Promise<SearchResult[]>;
