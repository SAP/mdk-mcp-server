import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { Chunker } from "./chunker.js";
import {
  createEmbeddings,
  loadChunks,
  searchEmbeddings,
  SearchResult,
} from "./lib/embeddings.js";

/**
 * This file is responsible for splitting our schema into smaller chunks, vectorizing them, then storing them.
 * It uses the Chunker class to chunk the JSON schema files, then embeds the chunks using a SentenceTransformer model.
 * The chunks are stored in a local vector database (ChromaDB) for semantic similarity search.
 * Semantic similarity search is used instead of keyword search because it can handle synonyms and related terms better.
 */

// Interfaces for type safety
interface Document {
  source: string;
  content: string;
}

interface Chunk {
  content: string;
  source: string;
}

/**
 * Load documents from a specified folder, filtering by allowed file extensions by
 * returning a list of dictionaries containing file contents and file names.
 */
function loadDocumentsFromFolder(
  folderPath: string,
  allowedExts: Set<string> = new Set([".json", ".schema"])
): Document[] {
  const docs: Document[] = [];

  function walkDirectory(dir: string): void {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDirectory(fullPath);
      } else if (allowedExts.has(path.extname(file))) {
        const content = fs.readFileSync(fullPath, "utf8");
        docs.push({
          source: fullPath,
          content: content,
        });
      }
    }
  }

  walkDirectory(folderPath);
  return docs;
}

/**
 * Split documents into chunks using the Chunker, each chunk to be used for vector embedding.
 * Each chunk contains chunk content (described in mdk_chunker.ts) and the source (filename and chunk number).
 */
function splitDocuments(docs: Document[]): Chunk[] {
  const splitter = new Chunker();
  const chunks: Chunk[] = [];

  for (const doc of docs) {
    const docChunks = splitter.splitText(doc.content);
    docChunks.forEach((chunk, chunkNum) => {
      chunks.push({
        content: chunk, // raw text content
        source: `${doc.source}, chunk ${chunkNum}`, // from filename and chunk section
      });
    });
  }

  return chunks;
}

/**
 * Combines all of the above functions to:
 *   1. Load documents from the specified folder.
 *   2. Split the documents into chunks using the Chunker.
 *   3. Embed the chunks using the SentenceTransformer model.
 *   4. Store the chunks and their embeddings in the vector database.
 * This is the main function to be called to populate the vector database with MDK schema data.
 */
export function retrieveAndStore(folderPath: string, version: string): void {
  const docs = loadDocumentsFromFolder(path.join(folderPath, version));
  const chunks = splitDocuments(docs);

  const texts = chunks.map(chunk => chunk.source + "\n" + chunk.content);
  createEmbeddings(`schema-chunks-${version}`, texts);

  const names = docs.map(doc => {
    const filename = path.basename(doc.source);
    return filename ? filename.split(".")[0] : "";
  });
  createEmbeddings(`name-chunks-${version}`, names);
}

/**
 * Search the vector database for the most similar documents to the query.
 * It embeds the query using the SentenceTransformer model, then queries the vector database for the top_n most similar documents.
 * Returns a list of dictionaries containing the source, distance, and content of the matching documents.
 * Lower distance means more similarity.
 * This is mainly used in the server to search for MDK components based on queries that may not match the exact component description.
 */
export async function search(
  query: string,
  topN: number,
  version: string
): Promise<SearchResult[]> {
  const chunks = await loadChunks(`schema-chunks-${version}`);
  const embeddingResults: SearchResult[] = (
    await searchEmbeddings(query, chunks)
  ).slice(0, topN);

  return embeddingResults;
}

/**
 * Search the names collection for the most similar component names to the query.
 * It embeds the query using the SentenceTransformer model, then queries the names collection for the top_n most similar names.
 * Returns a dictionary containing the names and distances.
 * Lower distance means more similarity.
 * This is mainly used in the server to correct any typos if a function requires an exact component name, such as get_component_documentation().
 */
export async function searchNames(
  query: string,
  topN: number,
  version: string
): Promise<SearchResult[]> {
  const chunks = await loadChunks(`name-chunks-${version}`);
  const embeddingResults: SearchResult[] = (
    await searchEmbeddings(query, chunks)
  ).slice(0, topN);

  return embeddingResults;
}

/**
 * Debugging function to print search results in a readable format.
 */
export function printResults(results: SearchResult[]): string {
  const searchResults: {
    source: string;
    distance: string;
    content: string;
  }[] = [];
  for (const result of results) {
    const searchResult: {
      source: string;
      distance: string;
      content: string;
    } = {
      source: "",
      distance: "",
      content: "",
    };
    const index = result.content.indexOf("\n");
    const source = result.content.substring(0, index);
    const filename = path.basename(source);
    searchResult.source = filename ? filename.split(".")[0].toLowerCase() : "";
    searchResult.distance = result.similarity.toFixed(2);
    searchResult.content = result.content.substring(index + 1);
    searchResults.push(searchResult);
  }
  return JSON.stringify(searchResults, null, 2);
}

export function getDocuments(version: string): [string[], string[]] {
  /**Load all documentation files into a global list.*/
  const filenameList: string[] = [];
  const contentList: string[] = [];

  function walkDirectory(dir: string): void {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDirectory(fullPath);
      } else if (
        file.endsWith(".json") ||
        file.endsWith(".schema") ||
        file.endsWith(".example.md")
      ) {
        const content = fs.readFileSync(fullPath, "utf8");
        filenameList.push(file);
        contentList.push(content);
      }
    }
  }

  // Get the directory where this module is located, then go up to find res/schemas
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname, "..");
  walkDirectory(path.join(projectRoot, "res/schemas", version));
  return [filenameList, contentList];
}
