/**
 * Wrapper around @sap/artifact-management library
 * Provides simplified API for CAP service metadata operations
 */

import { createMockVSCode } from "./vscode-api-mock.js";

// Type definitions for artifact-management
interface ServiceInfo {
  name: string;
  path: string;
  entryPath: string;
  destination?: string;
  sourcePath?: string;
  entities?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ArtifactManagementAPI {
  getServicesInfo(projectPath: string): Promise<ServiceInfo[]>;
  getServiceEdmx(projectPath: string, serviceName: string): Promise<string>;
}

let artifactManagement: ArtifactManagementAPI | null = null;

/**
 * Initialize artifact-management with mock VSCode API
 */
async function initializeArtifactManagement(
  workspaceRoot: string
): Promise<ArtifactManagementAPI> {
  if (artifactManagement) {
    return artifactManagement;
  }

  try {
    // Setup mock VSCode environment
    const mockVSCode = createMockVSCode(workspaceRoot);

    // Inject mock VSCode into global scope (required by artifact-management)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).vscode = mockVSCode;

    // Load artifact-management-base library
    const artifactMgmtBase = await import("@sap/artifact-management-base");
    const { CapApi } = artifactMgmtBase.default;
    const { NodeFileSystem } = artifactMgmtBase;

    if (!CapApi || !NodeFileSystem) {
      throw new Error("CapApi or NodeFileSystem class not found in module");
    }

    // Create filesystem instance for the workspace
    const fs = new NodeFileSystem(workspaceRoot, workspaceRoot);

    // Find all .cds files in the project (typically in srv/, db/, app/ directories)
    const cdsPaths: string[] = [];
    const dirsToCheck = ["srv", "db", "app", "."];

    for (const dir of dirsToCheck) {
      try {
        // Navigate to the directory
        const dirFs = dir === "." ? fs : fs.navigate(dir);
        // Read .cds files
        const files = await dirFs.readFiles({ ext: "cds" });
        cdsPaths.push(
          ...files.map((f: string) => (dir === "." ? f : `${dir}/${f}`))
        );
      } catch {
        // Directory might not exist, continue
      }
    }

    if (cdsPaths.length === 0) {
      throw new Error(
        "No .cds files found in project. This does not appear to be a CAP project."
      );
    }

    // Create CapApi with filesystem and CDS file paths
    const am = new CapApi(fs, cdsPaths);

    // Load the CAP model for the project with flavor option
    await am.load({ flavor: "inferred" });

    artifactManagement = {
      async getServicesInfo(_projectPath: string): Promise<ServiceInfo[]> {
        try {
          // Get services from CAP model (synchronous call)
          const services = am.services();

          // Transform to ServiceInfo format
          const serviceInfos: ServiceInfo[] = [];
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
            const serviceEntities: string[] = [];

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
        } catch (error) {
          console.error("Error getting services info:", error);
          return [];
        }
      },

      async getServiceEdmx(
        projectPath: string,
        serviceName: string
      ): Promise<string> {
        try {
          // Get EDMX for the service
          const edmx = await am.edmx(serviceName);
          return edmx || "";
        } catch (error) {
          console.error("Error getting service EDMX:", error);
          return "";
        }
      },
    };

    return artifactManagement;
  } catch (error) {
    console.error("Failed to initialize artifact-management:", error);
    throw new Error("Artifact management initialization failed");
  }
}

/**
 * Get services information from a CAP project
 */
export async function getServicesInfo(
  projectPath: string
): Promise<ServiceInfo[]> {
  try {
    const am = await initializeArtifactManagement(projectPath);
    return await am.getServicesInfo(projectPath);
  } catch (error) {
    console.error("Error in getServicesInfo wrapper:", error);
    return [];
  }
}

/**
 * Get EDMX metadata for a specific service
 */
export async function getServiceEdmx(
  projectPath: string,
  serviceName: string
): Promise<string> {
  try {
    const am = await initializeArtifactManagement(projectPath);
    return await am.getServiceEdmx(projectPath, serviceName);
  } catch (error) {
    console.error("Error in getServiceEdmx wrapper:", error);
    return "";
  }
}

/**
 * Extract entity sets from services info
 */
export function extractEntitySetsFromServicesInfo(
  servicesInfo: ServiceInfo[]
): string[] {
  const entitySets: string[] = [];

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
export async function isArtifactManagementAvailable(): Promise<boolean> {
  try {
    await import("@sap/artifact-management-base");
    return true;
  } catch {
    return false;
  }
}
