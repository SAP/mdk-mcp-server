import { Octokit } from "@octokit/rest";
import * as path from "path";
import * as fs from "fs";
import { getLogger } from "./utils.js";
const logger = getLogger();
export class GitHubFetcher {
    octokit;
    cacheDir;
    constructor(authToken, cacheDir = "./cache/github") {
        this.octokit = new Octokit({
            auth: authToken,
        });
        this.cacheDir = cacheDir;
        this.ensureCacheDir();
    }
    ensureCacheDir() {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }
    /**
     * Parse GitHub URL to extract owner, repo, path, and branch
     */
    parseGitHubUrl(url) {
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
                    }
                    else if (match.length === 4) {
                        // URL with branch but no path
                        return {
                            owner: match[1],
                            repo: match[2],
                            branch: match[3],
                            path: "",
                        };
                    }
                    else if (match.length === 3) {
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
        }
        catch (error) {
            logger.error(`Error parsing GitHub URL: ${url}`, error);
            return null;
        }
    }
    /**
     * Fetch all files from a GitHub repository path recursively
     */
    async fetchRepositoryContent(source, fileExtensions = [".md", ".json", ".ts", ".js", ".html"]) {
        const files = [];
        const branch = source.branch || "master";
        logger.info(`Fetching content from ${source.owner}/${source.repo}/${source.path || "root"} (${branch})`);
        try {
            await this.fetchDirectoryRecursive(source.owner, source.repo, source.path || "", branch, files, fileExtensions);
            logger.info(`Fetched ${files.length} files from ${source.owner}/${source.repo}`);
            return files;
        }
        catch (error) {
            logger.error(`Error fetching repository content: ${error}`);
            throw error;
        }
    }
    /**
     * Recursively fetch directory contents
     */
    async fetchDirectoryRecursive(owner, repo, dirPath, branch, files, fileExtensions) {
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
                    const content = await this.fetchFileContent(owner, repo, response.data.path, branch);
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
                if (item.type === "file" &&
                    this.shouldIncludeFile(item.name, fileExtensions)) {
                    const content = await this.fetchFileContent(owner, repo, item.path, branch);
                    if (content) {
                        files.push({
                            path: item.path,
                            content,
                            url: item.html_url || "",
                        });
                    }
                }
                else if (item.type === "dir") {
                    await this.fetchDirectoryRecursive(owner, repo, item.path, branch, files, fileExtensions);
                }
            }
        }
        catch (error) {
            const err = error;
            if (err.status === 404) {
                logger.warn(`Path not found: ${dirPath}`);
            }
            else {
                logger.error(`Error fetching directory ${dirPath}:`, error);
            }
        }
    }
    /**
     * Fetch content of a single file
     */
    async fetchFileContent(owner, repo, filePath, branch) {
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
            const content = Buffer.from(response.data.content, "base64").toString("utf-8");
            return content;
        }
        catch (error) {
            logger.error(`Error fetching file ${filePath}:`, error);
            return null;
        }
    }
    /**
     * Check if file should be included based on extension
     */
    shouldIncludeFile(filename, extensions) {
        return extensions.some(ext => filename.toLowerCase().endsWith(ext));
    }
    /**
     * Cache fetched content to disk
     */
    async cacheContent(source, files) {
        const cacheKey = `${source.owner}_${source.repo}_${source.path.replace(/\//g, "_")}`;
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
    loadCachedContent(source) {
        const cacheKey = `${source.owner}_${source.repo}_${source.path.replace(/\//g, "_")}`;
        const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);
        if (fs.existsSync(cachePath)) {
            try {
                const cacheData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
                logger.info(`Loaded ${cacheData.files.length} files from cache`);
                return cacheData.files;
            }
            catch (error) {
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
export async function fetchGitHubKnowledge(urls, authToken, useCache = true) {
    const fetcher = new GitHubFetcher(authToken);
    const allFiles = [];
    for (const url of urls) {
        const source = fetcher.parseGitHubUrl(url);
        if (!source) {
            logger.warn(`Skipping invalid URL: ${url}`);
            continue;
        }
        try {
            // Try to load from cache first
            let files = null;
            if (useCache) {
                files = fetcher.loadCachedContent(source);
            }
            // Fetch if not in cache
            if (!files) {
                files = await fetcher.fetchRepositoryContent(source);
                await fetcher.cacheContent(source, files);
            }
            allFiles.push(...files);
        }
        catch (error) {
            logger.error(`Error processing ${url}:`, error);
        }
    }
    return allFiles;
}
