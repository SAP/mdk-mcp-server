import { Octokit } from "@octokit/rest";
import * as path from "path";
import * as fs from "fs";
import { getLogger } from "./utils.js";

const logger = getLogger();

interface GitHubSource {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
}

interface GitHubFile {
  path: string;
  content: string;
  url: string;
}

export class GitHubFetcher {
  private octokit: Octokit;
  private cacheDir: string;

  constructor(authToken?: string, cacheDir: string = "./cache/github") {
    this.octokit = new Octokit({
      auth: authToken,
    });
    this.cacheDir = cacheDir;
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Parse GitHub URL to extract owner, repo, path, and branch
   */
  parseGitHubUrl(url: string): GitHubSource | null {
    try {
      // Handle both github.com and github.wdf.sap.corp URLs
      const patterns = [
        // Standard GitHub: https://github.com/owner/repo/tree/branch/path
        /github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+)/,
        // Standard GitHub: https://github.com/owner/repo/tree/branch (no path)
        /github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/?$/,
        // GitHub Enterprise: https://github.wdf.sap.corp/owner/repo/tree/branch/path
        /github\.wdf\.sap\.corp\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+)/,
        // GitHub Enterprise: https://github.wdf.sap.corp/owner/repo/tree/branch (no path)
        /github\.wdf\.sap\.corp\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/?$/,
        // Without tree/branch: https://github.com/owner/repo
        /github\.com\/([^/]+)\/([^/]+)\/?$/,
        /github\.wdf\.sap\.corp\/([^/]+)\/([^/]+)\/?$/,
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          if (match.length === 5) {
            // Full URL with branch and path
            return {
              owner: match[1],
              repo: match[2],
              branch: match[3],
              path: match[4],
            };
          } else if (match.length === 4) {
            // URL with branch but no path
            return {
              owner: match[1],
              repo: match[2],
              branch: match[3],
              path: "",
            };
          } else if (match.length === 3) {
            // Just owner and repo
            return {
              owner: match[1],
              repo: match[2].replace(/\.git$/, ""),
              path: "",
              branch: "main",
            };
          }
        }
      }

      logger.warn(`Could not parse GitHub URL: ${url}`);
      return null;
    } catch (error) {
      logger.error(`Error parsing GitHub URL: ${url}`, error);
      return null;
    }
  }

  /**
   * Fetch all files from a GitHub repository path recursively
   */
  async fetchRepositoryContent(
    source: GitHubSource,
    fileExtensions: string[] = [".md", ".json", ".ts", ".js", ".html"]
  ): Promise<GitHubFile[]> {
    const files: GitHubFile[] = [];
    const branch = source.branch || "master";

    logger.info(
      `Fetching content from ${source.owner}/${source.repo}/${
        source.path || "root"
      } (${branch})`
    );

    try {
      await this.fetchDirectoryRecursive(
        source.owner,
        source.repo,
        source.path || "",
        branch,
        files,
        fileExtensions
      );

      logger.info(
        `Fetched ${files.length} files from ${source.owner}/${source.repo}`
      );
      return files;
    } catch (error) {
      logger.error(`Error fetching repository content: ${error}`);
      throw error;
    }
  }

  /**
   * Recursively fetch directory contents
   */
  private async fetchDirectoryRecursive(
    owner: string,
    repo: string,
    dirPath: string,
    branch: string,
    files: GitHubFile[],
    fileExtensions: string[]
  ): Promise<void> {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path: dirPath,
        ref: branch,
      });

      if (!Array.isArray(response.data)) {
        // Single file
        if (this.shouldIncludeFile(response.data.name, fileExtensions)) {
          const content = await this.fetchFileContent(
            owner,
            repo,
            response.data.path,
            branch
          );
          if (content) {
            files.push({
              path: response.data.path,
              content,
              url: response.data.html_url || "",
            });
          }
        }
        return;
      }

      // Directory
      for (const item of response.data) {
        if (
          item.type === "file" &&
          this.shouldIncludeFile(item.name, fileExtensions)
        ) {
          const content = await this.fetchFileContent(
            owner,
            repo,
            item.path,
            branch
          );
          if (content) {
            files.push({
              path: item.path,
              content,
              url: item.html_url || "",
            });
          }
        } else if (item.type === "dir") {
          await this.fetchDirectoryRecursive(
            owner,
            repo,
            item.path,
            branch,
            files,
            fileExtensions
          );
        }
      }
    } catch (error: unknown) {
      const err = error as { status?: number };
      if (err.status === 404) {
        logger.warn(`Path not found: ${dirPath}`);
      } else {
        logger.error(`Error fetching directory ${dirPath}:`, error);
      }
    }
  }

  /**
   * Fetch content of a single file
   */
  private async fetchFileContent(
    owner: string,
    repo: string,
    filePath: string,
    branch: string
  ): Promise<string | null> {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: branch,
      });

      if (Array.isArray(response.data) || response.data.type !== "file") {
        return null;
      }

      // Decode base64 content
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8"
      );
      return content;
    } catch (error) {
      logger.error(`Error fetching file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Check if file should be included based on extension
   */
  private shouldIncludeFile(filename: string, extensions: string[]): boolean {
    return extensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  /**
   * Cache fetched content to disk
   */
  async cacheContent(source: GitHubSource, files: GitHubFile[]): Promise<void> {
    const cacheKey = `${source.owner}_${source.repo}_${source.path.replace(
      /\//g,
      "_"
    )}`;
    const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);

    const cacheData = {
      source,
      fetchedAt: new Date().toISOString(),
      files,
    };

    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
    logger.info(`Cached ${files.length} files to ${cachePath}`);
  }

  /**
   * Load cached content from disk
   */
  loadCachedContent(source: GitHubSource): GitHubFile[] | null {
    const cacheKey = `${source.owner}_${source.repo}_${source.path.replace(
      /\//g,
      "_"
    )}`;
    const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);

    if (fs.existsSync(cachePath)) {
      try {
        const cacheData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
        logger.info(`Loaded ${cacheData.files.length} files from cache`);
        return cacheData.files;
      } catch (error) {
        logger.error(`Error loading cache: ${error}`);
        return null;
      }
    }

    return null;
  }
}

/**
 * Fetch content from multiple GitHub sources
 */
export async function fetchGitHubKnowledge(
  urls: string[],
  authToken?: string,
  useCache: boolean = true
): Promise<GitHubFile[]> {
  const fetcher = new GitHubFetcher(authToken);
  const allFiles: GitHubFile[] = [];

  for (const url of urls) {
    const source = fetcher.parseGitHubUrl(url);
    if (!source) {
      logger.warn(`Skipping invalid URL: ${url}`);
      continue;
    }

    try {
      // Try to load from cache first
      let files: GitHubFile[] | null = null;
      if (useCache) {
        files = fetcher.loadCachedContent(source);
      }

      // Fetch if not in cache
      if (!files) {
        files = await fetcher.fetchRepositoryContent(source);
        await fetcher.cacheContent(source, files);
      }

      allFiles.push(...files);
    } catch (error) {
      logger.error(`Error processing ${url}:`, error);
    }
  }

  return allFiles;
}
