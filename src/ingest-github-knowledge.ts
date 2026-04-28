#!/usr/bin/env node

import { fetchGitHubKnowledge } from "./github-fetcher.js";
import { chunkText } from "./chunker.js";
import { VectorDatabase } from "./vector.js";
import { getLogger } from "./utils.js";
import * as path from "path";

const logger = getLogger();

interface KnowledgeSource {
  name: string;
  url: string;
  type: "docs" | "samples" | "tutorials";
}

const MDK_KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    name: "MDK Tutorial Samples",
    url: "https://github.com/SAP-samples/cloud-mdk-tutorial-samples/tree/main",
    type: "tutorials",
  },
  {
    name: "MDK Samples",
    url: "https://github.com/SAP-samples/cloud-mdk-samples/tree/main",
    type: "samples",
  },
];

interface IngestOptions {
  sources?: KnowledgeSource[];
  githubToken?: string;
  useCache?: boolean;
  vectorDbPath?: string;
  chunkSize?: number;
  chunkOverlap?: number;
}

export async function ingestGitHubKnowledge(
  options: IngestOptions = {}
): Promise<void> {
  const {
    sources = MDK_KNOWLEDGE_SOURCES,
    githubToken = process.env.GITHUB_TOKEN,
    useCache = true,
    vectorDbPath = "./knowledge.db",
    chunkSize = 1000,
    chunkOverlap = 200,
  } = options;

  logger.info("Starting GitHub knowledge ingestion...");
  logger.info(`Sources: ${sources.map(s => s.name).join(", ")}`);

  try {
    // Fetch content from all sources
    const urls = sources.map(s => s.url);
    const files = await fetchGitHubKnowledge(urls, githubToken, useCache);

    logger.info(`Fetched ${files.length} files from GitHub sources`);

    // Initialize vector database
    const vectorDb = new VectorDatabase(vectorDbPath);

    // Process and chunk each file
    let totalChunks = 0;
    const documents: Array<{
      content: string;
      metadata: Record<string, unknown>;
    }> = [];

    for (const file of files) {
      try {
        // Determine source type
        const source = sources.find(s =>
          file.url.includes(s.url.split("/").slice(3).join("/"))
        );
        const sourceType = source?.type || "unknown";
        const sourceName = source?.name || "Unknown";

        // Chunk the content
        const chunks = chunkText(file.content, chunkSize, chunkOverlap);

        for (let i = 0; i < chunks.length; i++) {
          documents.push({
            content: chunks[i],
            metadata: {
              source: sourceName,
              sourceType,
              filePath: file.path,
              url: file.url,
              chunkIndex: i,
              totalChunks: chunks.length,
              timestamp: new Date().toISOString(),
            },
          });
        }

        totalChunks += chunks.length;
      } catch (error) {
        logger.error(`Error processing file ${file.path}:`, error);
      }
    }

    logger.info(`Created ${totalChunks} chunks from ${files.length} files`);

    // Add documents to vector database
    logger.info("Adding documents to vector database...");
    await vectorDb.addDocuments(documents);

    logger.info("GitHub knowledge ingestion completed successfully!");
    logger.info(`Total files: ${files.length}`);
    logger.info(`Total chunks: ${totalChunks}`);
    logger.info(
      `Vector database: build/embeddings/${path.basename(
        vectorDbPath
      )}.json and .bin`
    );
  } catch (error) {
    logger.error("Error during knowledge ingestion:", error);
    throw error;
  }
}

// CLI execution - ES module compatible check
import { fileURLToPath } from "url";

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const args = process.argv.slice(2);
  const options: IngestOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--no-cache":
        options.useCache = false;
        break;
      case "--github-token":
        options.githubToken = args[++i];
        break;
      case "--vector-db":
        options.vectorDbPath = args[++i];
        break;
      case "--chunk-size":
        options.chunkSize = parseInt(args[++i], 10);
        break;
      case "--chunk-overlap":
        options.chunkOverlap = parseInt(args[++i], 10);
        break;
      case "--help":
        console.log(`
MDK GitHub Knowledge Ingestion Tool

Usage: node build/ingest-github-knowledge.js [options]

Options:
  --no-cache           Disable cache and fetch fresh content
  --github-token TOKEN GitHub authentication token
  --vector-db PATH     Path to vector database file (default: ./knowledge.db)
  --chunk-size SIZE    Chunk size in characters (default: 1000)
  --chunk-overlap SIZE Chunk overlap in characters (default: 200)
  --help               Show this help message

Environment Variables:
  GITHUB_TOKEN         GitHub authentication token (can be used instead of --github-token)
        `);
        process.exit(0);
    }
  }

  // Handle process cleanup properly to avoid mutex lock errors from native libraries
  // We suppress stderr output for native library cleanup errors but let the process exit naturally
  const originalStderrWrite = process.stderr.write.bind(process.stderr);
  let ingestionComplete = false;

  process.stderr.write = function (
    chunk: string | Uint8Array,
    encodingOrCallback?: string | ((error?: Error | null) => void) | undefined,
    callback?: ((error?: Error | null) => void) | undefined
  ): boolean {
    const text = chunk.toString();
    // Suppress native library cleanup errors after successful ingestion
    if (
      ingestionComplete &&
      (text.includes("libc++abi") || text.includes("mutex lock failed"))
    ) {
      const cb =
        typeof encodingOrCallback === "function"
          ? encodingOrCallback
          : callback;
      if (cb) {
        cb();
      }
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return originalStderrWrite(chunk, encodingOrCallback as any, callback);
  };

  ingestGitHubKnowledge(options)
    .then(() => {
      logger.info("Ingestion complete!");
      ingestionComplete = true;
      // Exit gracefully without forcing process.exit() to avoid native library cleanup issues
      // The process will exit naturally when the event loop is empty
    })
    .catch(error => {
      logger.error("Ingestion failed:", error);
      process.exit(1);
    });
}
