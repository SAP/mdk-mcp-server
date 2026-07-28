import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);
/**
 * Offline OData client using ilodata CLI tool
 */
export class OfflineODataClient {
    storeName;
    ilodataPath;
    storeKey;
    constructor(config) {
        this.storeName = config.storeName || "lodata";
        this.storeKey = config.storeKey;
        // Use provided ilodata path or default to "ilodata" (assumes it's in PATH)
        this.ilodataPath = config.ilodataPath || "ilodata";
    }
    /**
     * Execute ilodata command
     */
    async executeILOData(command, options) {
        const baseOptions = [`store_name="${this.storeName}"`];
        if (this.storeKey) {
            baseOptions.push(`store_key="${this.storeKey}"`);
        }
        // If rawCommand is true, wrap the command in command="" parameter
        // Must escape $ as \$ for ilodata, but in bash that needs to be \\$
        // So we replace $ with \\$ in the command string
        const commandPart = options?.rawCommand
            ? `command="${command.replace(/\$/g, "\\\\$")}"`
            : command;
        const fullCommand = `${this.ilodataPath} ${baseOptions.join(" ")} ${commandPart}`;
        try {
            const { stdout, stderr } = await execAsync(fullCommand, {
                shell: "/bin/bash",
                maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large responses
            });
            if (stderr && !stderr.includes("INFO")) {
                console.warn("ILOData stderr:", stderr);
            }
            return stdout;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`ILOData command failed: ${errorMessage}\nCommand: ${fullCommand}`);
        }
    }
    /**
     * Close connection (no-op for ilodata, kept for compatibility)
     */
    close() {
        // ilodata doesn't maintain persistent connections
    }
    /**
     * Open store in interactive mode (optional - not needed when using command="..." format)
     * When using command="..." parameter, the store is automatically opened, queried, and closed.
     * This method is only useful if you want to use ilodata in interactive mode.
     */
    async openStore() {
        try {
            return await this.executeILOData("open", { rawCommand: true });
        }
        catch (error) {
            throw new Error(`Failed to open offline store "${this.storeName}". ` +
                `The store may not exist or may need to be downloaded first. ` +
                `Original error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get list of entity sets
     */
    async getEntitySets() {
        try {
            const output = await this.executeILOData("get", { rawCommand: true });
            const serviceDoc = JSON.parse(output);
            // Parse OData service document
            if (serviceDoc.value && Array.isArray(serviceDoc.value)) {
                return serviceDoc.value.map((item) => {
                    if (item &&
                        typeof item === "object" &&
                        ("name" in item || "url" in item)) {
                        return (item.name ||
                            item.url ||
                            "");
                    }
                    return "";
                });
            }
            return [];
        }
        catch (error) {
            console.error("Failed to get entity sets:", error);
            return [];
        }
    }
    /**
     * Get schema for an entity set using $metadata
     */
    async getEntitySchema(_entitySet) {
        try {
            // Get metadata - would need proper XML parsing for full implementation
            await this.executeILOData("get \\$metadata");
            // Parse XML metadata (simplified - would need proper XML parsing)
            // For now, return a basic structure
            return [
                {
                    name: "ID",
                    type: "Edm.String",
                    nullable: false,
                    key: true,
                },
            ];
        }
        catch (error) {
            console.error("Failed to get schema:", error);
            return [];
        }
    }
    /**
     * Query an entity set
     */
    async query(entitySet, options = {}) {
        // Build OData query parameters
        const queryParams = [];
        if (options.filter) {
            queryParams.push(`\\$filter=${encodeURIComponent(options.filter)}`);
        }
        if (options.select) {
            queryParams.push(`\\$select=${options.select}`);
        }
        if (options.expand) {
            queryParams.push(`\\$expand=${options.expand}`);
        }
        if (options.orderby) {
            queryParams.push(`\\$orderby=${options.orderby}`);
        }
        if (options.top !== undefined) {
            queryParams.push(`\\$top=${options.top}`);
        }
        if (options.skip !== undefined) {
            queryParams.push(`\\$skip=${options.skip}`);
        }
        // Always request count
        queryParams.push("\\$count=true");
        const query = queryParams.length > 0
            ? `${entitySet}?${queryParams.join("&")}`
            : entitySet;
        try {
            const output = await this.executeODataQuery(`get ${query}`);
            const result = JSON.parse(output);
            return {
                value: result.value || [],
                count: result["@odata.count"],
                "@odata.count": result["@odata.count"],
                metadata: {
                    entitySet,
                    returned: result.value ? result.value.length : 0,
                    total: result["@odata.count"],
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to query ${entitySet}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Execute a raw OData query string
     * @param queryString - Full OData query (e.g., "MyWorkOrderHeaders?$top=1")
     * @returns Parsed JSON result
     *
     * Example:
     *   await client.executeODataQuery("get MyWorkOrderHeaders?\\$top=1")
     *   await client.queryByString("MyWorkOrderHeaders?$top=1")
     *
     * Note: When using command="..." parameter format, ilodata automatically
     * opens, executes the query, and closes the store in a single operation.
     */
    async executeODataQuery(queryString) {
        try {
            // The queryString can be in two formats:
            // 1. "get EntitySet?$param=value" (with 'get' prefix)
            // 2. "EntitySet?$param=value" (without 'get' prefix)
            const hasGetPrefix = queryString.trim().toLowerCase().startsWith("get ");
            const command = hasGetPrefix ? queryString : `get ${queryString}`;
            const output = await this.executeILOData(command, { rawCommand: true });
            return JSON.parse(output);
        }
        catch (error) {
            throw new Error(`Failed to execute OData query "${queryString}": ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Query by raw OData string (convenience method)
     * @param odataQuery - OData query string (e.g., "MyWorkOrderHeaders?$top=1&$filter=Status eq 'Open'")
     * @returns Query result
     *
     * Example:
     *   const result = await client.queryByString("MyWorkOrderHeaders?$top=1");
     */
    async queryByString(odataQuery) {
        try {
            const result = (await this.executeODataQuery(odataQuery));
            // Parse entity set name from query
            const entitySet = odataQuery.split("?")[0].trim();
            return {
                value: result.value || [],
                count: result["@odata.count"],
                "@odata.count": result["@odata.count"],
                metadata: {
                    entitySet,
                    returned: result.value ? result.value.length : 0,
                    total: result["@odata.count"],
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to query by string "${odataQuery}": ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a single entity by key
     */
    async getEntity(entitySet, key) {
        // Build key predicate
        const keyParts = Object.entries(key).map(([k, v]) => {
            if (typeof v === "string") {
                return `${k}='${v}'`;
            }
            return `${k}=${v}`;
        });
        const keyPredicate = keyParts.join(",");
        const query = `${entitySet}(${keyPredicate})`;
        try {
            const output = await this.executeILOData(`get ${query}`);
            const result = JSON.parse(output);
            return result;
        }
        catch {
            return null;
        }
    }
    /**
     * Create a new entity
     */
    async create(entitySet, data) {
        // Build property assignments
        const props = Object.entries(data)
            .map(([key, value]) => {
            if (typeof value === "string") {
                return `${key}="${value}"`;
            }
            return `${key}=${value}`;
        })
            .join(" ");
        try {
            const output = await this.executeILOData(`post ${entitySet} ${props}`);
            const result = JSON.parse(output);
            return result;
        }
        catch (error) {
            throw new Error(`Failed to create entity in ${entitySet}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update an entity
     */
    async update(entitySet, key, data) {
        // Build key predicate
        const keyParts = Object.entries(key).map(([k, v]) => {
            if (typeof v === "string") {
                return `${k}='${v}'`;
            }
            return `${k}=${v}`;
        });
        const keyPredicate = keyParts.join(",");
        // Build property assignments
        const props = Object.entries(data)
            .map(([key, value]) => {
            if (typeof value === "string") {
                return `${key}="${value}"`;
            }
            return `${key}=${value}`;
        })
            .join(" ");
        try {
            await this.executeILOData(`patch ${entitySet}(${keyPredicate}) ${props}`);
            // After patch, retrieve the updated entity
            return (await this.getEntity(entitySet, key));
        }
        catch (error) {
            throw new Error(`Failed to update entity in ${entitySet}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete an entity
     */
    async delete(entitySet, key) {
        // Build key predicate
        const keyParts = Object.entries(key).map(([k, v]) => {
            if (typeof v === "string") {
                return `${k}='${v}'`;
            }
            return `${k}=${v}`;
        });
        const keyPredicate = keyParts.join(",");
        try {
            await this.executeILOData(`delete ${entitySet}(${keyPredicate})`);
        }
        catch (error) {
            throw new Error(`Failed to delete entity from ${entitySet}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Count entities in an entity set
     */
    async count(entitySet, filter) {
        const query = filter
            ? `${entitySet}/$count?\\$filter=${encodeURIComponent(filter)}`
            : `${entitySet}/$count`;
        try {
            const output = await this.executeILOData(`get ${query}`);
            return parseInt(output.trim(), 10);
        }
        catch (error) {
            throw new Error(`Failed to count entities in ${entitySet}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Execute custom OData request
     * @deprecated Use executeODataQuery or queryByString instead
     */
    async executeRequest(request) {
        return this.executeODataQuery(request);
    }
    /**
     * Get pending changes (request queue)
     */
    async getPendingChanges() {
        // ilodata can show pending requests in the queue
        // This would require accessing the request queue
        // For now, return empty array as this is store-internal
        return [];
    }
    /**
     * Upload pending changes (sync)
     */
    async uploadPendingChanges() {
        try {
            await this.executeILOData("upload");
            // Parse upload results
            return {
                success: true,
                uploaded: 0,
                errors: [],
            };
        }
        catch (error) {
            return {
                success: false,
                uploaded: 0,
                errors: [error],
            };
        }
    }
    /**
     * Get database statistics
     */
    async getStatistics() {
        const entitySets = await this.getEntitySets();
        const entityCounts = {};
        // Get count for each entity set
        for (const entitySet of entitySets) {
            try {
                entityCounts[entitySet] = await this.count(entitySet);
            }
            catch {
                entityCounts[entitySet] = 0;
            }
        }
        return {
            entityCounts,
        };
    }
}
/**
 * Utility functions for finding offline stores
 */
/**
 * Find offline stores in a directory
 */
export function findOfflineStores(directory) {
    const stores = [];
    function searchDirectory(dir) {
        if (!fs.existsSync(dir)) {
            return;
        }
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                // Recursively search subdirectories
                searchDirectory(fullPath);
            }
            else if (entry.isFile()) {
                // Check if it's an offline store database (exclude request queue databases)
                if (entry.name.endsWith(".udb") && !entry.name.endsWith("rq.udb")) {
                    stores.push(fullPath);
                }
            }
        }
    }
    searchDirectory(directory);
    return stores;
}
/**
 * Create an offline OData client instance
 */
export function createOfflineODataClient(config) {
    return new OfflineODataClient(config);
}
