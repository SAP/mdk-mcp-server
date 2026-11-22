/**
 * Wrapper around @sap/artifact-management library
 * Provides simplified API for CAP service metadata operations
 */
import fs from "fs";
import path from "path";
import { createMockVSCode } from "./vscode-api-mock.js";
import { validateSecurePath } from "./validation.js";
// Cache CAP models per workspace to prevent cross-project data leakage
// Key: canonical workspace path, Value: CAP API instance
const artifactManagementCache = new Map();
/**
 * Get canonical workspace key for caching
 * Uses fs.realpathSync to resolve symlinks and ensure consistent cache keys
 */
function getWorkspaceKey(workspaceRoot) {
    try {
        // Validate the workspace path for security
        const validatedPath = validateSecurePath(workspaceRoot);
        // Canonicalize to handle symlinks consistently
        return fs.realpathSync(validatedPath);
    }
    catch {
        // If path doesn't exist yet, use resolved absolute path
        return path.resolve(workspaceRoot);
    }
}
/**
 * Initialize artifact-management with mock VSCode API
 * Each workspace gets its own isolated CAP model instance
 */
async function initializeArtifactManagement(workspaceRoot) {
    // Get canonical workspace key to ensure cache consistency
    const workspaceKey = getWorkspaceKey(workspaceRoot);
    // Return cached instance if already initialized for this workspace
    const cached = artifactManagementCache.get(workspaceKey);
    if (cached) {
        return cached;
    }
    try {
        // Setup mock VSCode environment
        const mockVSCode = createMockVSCode(workspaceRoot);
        // Inject mock VSCode into global scope (required by artifact-management)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        globalThis.vscode = mockVSCode;
        // Load artifact-management-base library
        const artifactMgmtBase = await import("@sap/artifact-management-base");
        const { CapApi } = artifactMgmtBase.default;
        const { NodeFileSystem } = artifactMgmtBase;
        if (!CapApi || !NodeFileSystem) {
            throw new Error("CapApi or NodeFileSystem class not found in module");
        }
        // Create filesystem instance for the workspace
        const nodeFs = new NodeFileSystem(workspaceRoot, workspaceRoot);
        // Find all .cds files in the project (typically in srv/, db/, app/ directories)
        const cdsPaths = [];
        const dirsToCheck = ["srv", "db", "app", "."];
        for (const dir of dirsToCheck) {
            try {
                // Navigate to the directory
                const dirFs = dir === "." ? nodeFs : nodeFs.navigate(dir);
                // Read .cds files
                const files = await dirFs.readFiles({ ext: "cds" });
                cdsPaths.push(...files.map((f) => (dir === "." ? f : `${dir}/${f}`)));
            }
            catch {
                // Directory might not exist, continue
            }
        }
        if (cdsPaths.length === 0) {
            throw new Error("No .cds files found in project. This does not appear to be a CAP project.");
        }
        // Create CapApi with filesystem and CDS file paths
        const am = new CapApi(nodeFs, cdsPaths);
        // Load the CAP model for the project with flavor option
        await am.load({ flavor: "inferred" });
        const api = {
            async getServicesInfo(_projectPath) {
                try {
                    // Get services from CAP model (synchronous call)
                    const services = am.services();
                    // Transform to ServiceInfo format
                    const serviceInfos = [];
                    for (const service of services) {
                        // Service is a reflected CSN definition with properties like:
                        // - name: service name
                        // - urlPath: HTTP endpoint path (if available)
                        // - $location: file location information
                        const serviceName = service.name || "";
                        const urlPath = service.urlPath || `/${serviceName}`;
                        const location = service.$location || {};
                        const file = location.file || "";
                        // Get all entities in this service
                        const allEntities = am.entities();
                        const serviceEntities = [];
                        // Filter entities that belong to this service
                        for (const entity of allEntities) {
                            const entityName = entity.name || "";
                            // Check if entity belongs to this service (entity name starts with service name)
                            if (entityName.startsWith(`${serviceName}.`)) {
                                serviceEntities.push(entityName);
                            }
                        }
                        serviceInfos.push({
                            name: serviceName,
                            path: urlPath,
                            entryPath: urlPath,
                            destination: `${serviceName}-app-srv`,
                            sourcePath: file,
                            entities: serviceEntities,
                        });
                    }
                    return serviceInfos;
                }
                catch (error) {
                    console.error("Error getting services info:", error);
                    return [];
                }
            },
            async getServiceEdmx(_projectPath, serviceName) {
                try {
                    // Get EDMX for the service
                    const edmx = await am.edmx(serviceName);
                    return edmx || "";
                }
                catch (error) {
                    console.error("Error getting service EDMX:", error);
                    return "";
                }
            },
        };
        // Cache the API instance for this workspace
        artifactManagementCache.set(workspaceKey, api);
        return api;
    }
    catch (error) {
        console.error("Failed to initialize artifact-management:", error);
        throw new Error("Artifact management initialization failed", {
            cause: error,
        });
    }
}
/**
 * Get services information from a CAP project
 */
export async function getServicesInfo(projectPath) {
    try {
        const am = await initializeArtifactManagement(projectPath);
        return await am.getServicesInfo(projectPath);
    }
    catch (error) {
        console.error("Error in getServicesInfo wrapper:", error);
        return [];
    }
}
/**
 * Get EDMX metadata for a specific service
 */
export async function getServiceEdmx(projectPath, serviceName) {
    try {
        const am = await initializeArtifactManagement(projectPath);
        return await am.getServiceEdmx(projectPath, serviceName);
    }
    catch (error) {
        console.error("Error in getServiceEdmx wrapper:", error);
        return "";
    }
}
/**
 * Extract entity sets from services info
 */
export function extractEntitySetsFromServicesInfo(servicesInfo) {
    const entitySets = [];
    for (const service of servicesInfo) {
        if (service.entities && Array.isArray(service.entities)) {
            entitySets.push(...service.entities);
        }
    }
    return [...new Set(entitySets)]; // Remove duplicates
}
/**
 * Check if artifact-management is available
 */
export async function isArtifactManagementAvailable() {
    try {
        await import("@sap/artifact-management-base");
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Clear the CAP model cache for a specific workspace or all workspaces
 * Useful for testing or when workspace content changes significantly
 */
export function clearArtifactManagementCache(workspaceRoot) {
    if (workspaceRoot) {
        // Clear cache for specific workspace
        const workspaceKey = getWorkspaceKey(workspaceRoot);
        artifactManagementCache.delete(workspaceKey);
    }
    else {
        // Clear all cached instances
        artifactManagementCache.clear();
    }
}
/**
 * Get cache statistics for monitoring
 */
export function getArtifactManagementCacheStats() {
    return {
        size: artifactManagementCache.size,
        workspaces: Array.from(artifactManagementCache.keys()),
    };
}
