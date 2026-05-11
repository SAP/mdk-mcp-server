/**
 * Utility functions for CAP project operations
 */

import * as fs from "fs";
import * as path from "path";
import {
  getServicesInfo,
  getServiceEdmx,
  extractEntitySetsFromServicesInfo,
  isArtifactManagementAvailable,
} from "./artifact-management-wrapper.js";

/**
 * Check if a directory is a CAP project
 * If the path is inside an app/ folder, check the parent directory
 */
export function isCapProject(projectPath: string): boolean {
  // If the path is inside an app/ folder, check the parent directory
  const pathParts = projectPath.split(path.sep);
  const appIndex = pathParts.lastIndexOf("app");

  let checkPath = projectPath;
  if (appIndex !== -1 && appIndex > 0) {
    // Remove app/ and everything after it to get the CAP root
    checkPath = pathParts.slice(0, appIndex).join(path.sep);
  }

  // Check for .cdsrc.json
  const cdsrcPath = path.join(checkPath, ".cdsrc.json");
  if (fs.existsSync(cdsrcPath)) {
    return true;
  }

  // Check for @sap/cds dependency
  const packageJsonPath = path.join(checkPath, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      if (
        (packageJson.dependencies && "@sap/cds" in packageJson.dependencies) ||
        (packageJson.devDependencies &&
          "@sap/cds" in packageJson.devDependencies)
      ) {
        return true;
      }
    } catch (error) {
      console.error("Error reading package.json:", error);
    }
  }

  return false;
}

/**
 * Get CAP project name from package.json
 */
export function getCapProjectName(projectPath: string): string {
  const packageJsonPath = path.join(projectPath, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      return packageJson.name || path.basename(projectPath);
    } catch (error) {
      console.error("Error reading project name:", error);
    }
  }
  return path.basename(projectPath);
}

/**
 * Get services information from a CAP project
 */
export async function getCapServicesInfo(projectPath: string) {
  if (!isArtifactManagementAvailable()) {
    console.warn("Artifact management not available");
    return [];
  }

  try {
    return await getServicesInfo(projectPath);
  } catch (error) {
    console.error("Error getting CAP services info:", error);
    return [];
  }
}

/**
 * Get EDMX metadata for a CAP service
 */
export async function getCapServiceEdmx(
  projectPath: string,
  serviceName: string
): Promise<string> {
  if (!isArtifactManagementAvailable()) {
    console.warn("Artifact management not available");
    return "";
  }

  try {
    return await getServiceEdmx(projectPath, serviceName);
  } catch (error) {
    console.error("Error getting CAP service EDMX:", error);
    return "";
  }
}

/**
 * Extract entity sets from CAP project
 */
export async function extractEntitySetsFromCapProject(
  projectPath: string
): Promise<string[]> {
  try {
    const servicesInfo = await getCapServicesInfo(projectPath);
    return extractEntitySetsFromServicesInfo(servicesInfo);
  } catch (error) {
    console.error("Error extracting entity sets:", error);
    return [];
  }
}

/**
 * Resolve the MDK project path within a CAP project.
 * In CAP projects, MDK apps typically live under app/<appname>/.
 * If folderRootPath is already an MDK project (has Application.app), return as-is.
 * If it's a CAP root, find the MDK sub-project under app/.
 */
export function resolveMdkProjectPath(folderRootPath: string): string {
  // If the path itself contains Application.app, it's already an MDK project
  if (fs.existsSync(path.join(folderRootPath, "Application.app"))) {
    return folderRootPath;
  }

  // Check if this is a CAP project
  if (!isCapProject(folderRootPath)) {
    return folderRootPath;
  }

  // Look for MDK sub-project under app/ directory
  const appDir = path.join(folderRootPath, "app");
  if (fs.existsSync(appDir) && fs.statSync(appDir).isDirectory()) {
    const entries = fs.readdirSync(appDir);
    for (const entry of entries) {
      const subPath = path.join(appDir, entry);
      if (
        fs.statSync(subPath).isDirectory() &&
        fs.existsSync(path.join(subPath, "Application.app"))
      ) {
        return subPath;
      }
    }
  }

  // No MDK sub-project found, return original path
  return folderRootPath;
}

/**
 * Get comprehensive CAP project information including services, entities, and structure.
 * This provides all the context an LLM needs to work with a CAP+MDK project.
 */
export async function getCapProjectInfo(projectPath: string): Promise<{
  isCapProject: boolean;
  projectName: string;
  services: Array<{
    name: string;
    path: string;
    entities: string[];
  }>;
  mdkProjectPath: string | null;
  hasServiceMetadata: boolean;
  edmxAvailable: boolean;
}> {
  const result = {
    isCapProject: false,
    projectName: path.basename(projectPath),
    services: [] as Array<{
      name: string;
      path: string;
      entities: string[];
    }>,
    mdkProjectPath: null as string | null,
    hasServiceMetadata: false,
    edmxAvailable: false,
  };

  if (!isCapProject(projectPath)) {
    return result;
  }
  result.isCapProject = true;
  result.projectName = getCapProjectName(projectPath);

  // Check for existing MDK sub-project
  const mdkPath = resolveMdkProjectPath(projectPath);
  if (mdkPath !== projectPath) {
    result.mdkProjectPath = mdkPath;
  }

  // Check for .service.metadata
  const metadataPath = path.join(
    result.mdkProjectPath || projectPath,
    ".service.metadata"
  );
  result.hasServiceMetadata = fs.existsSync(metadataPath);

  // Try to get services info from CDS models
  try {
    const servicesInfo = await getCapServicesInfo(projectPath);
    if (servicesInfo.length > 0) {
      result.edmxAvailable = true;
      result.services = servicesInfo.map(s => ({
        name: s.name,
        path: s.urlPath || s.path || "",
        entities: s.entities || extractEntitySetsFromServicesInfo([s]),
      }));
    }
  } catch {
    // artifact-management may not be available
  }

  return result;
}

/**
 * Generate .service.metadata content from CAP CDS models for a given service.
 * This bridges the gap between CAP CDS and MDK's expected metadata format.
 */
export async function generateServiceMetadataFromCap(
  capProjectPath: string,
  serviceName: string,
  applicationId: string
): Promise<string | null> {
  try {
    // Get EDMX from CDS model
    const edmx = await getCapServiceEdmx(capProjectPath, serviceName);
    if (!edmx) {
      return null;
    }

    // Use service name as destination name
    const destinationName = serviceName.replace(/\./g, "_");

    // Create .service.metadata structure
    const metadata = {
      mobile: {
        api: "",
        app: applicationId,
        destinations: [
          {
            name: destinationName,
            relativeUrl: "",
            metadata: {
              odataContent: edmx,
            },
            type: "Mobile",
          },
        ],
      },
    };

    return JSON.stringify(metadata, null, 4);
  } catch (error) {
    console.error("Error generating service metadata from CAP:", error);
    return null;
  }
}

/**
 * Get MDK configuration for a CAP project
 */
export interface CapMdkConfig {
  isCapProject: boolean;
  projectName: string;
  mdkProjectPath: string;
  projectType: "headless";
  services: Array<{
    name: string;
    urlPath?: string;
    path?: string;
    entities?: string[];
  }>;
  entitySets: string[];
}

export async function getCapMdkConfig(
  projectPath: string
): Promise<CapMdkConfig> {
  const isCap = isCapProject(projectPath);
  const projectName = getCapProjectName(projectPath);

  if (!isCap) {
    return {
      isCapProject: false,
      projectName,
      mdkProjectPath: projectPath,
      projectType: "headless",
      services: [],
      entitySets: [],
    };
  }

  // For CAP projects, MDK project goes in app/ subfolder
  // Replace hyphens with underscores in the project name
  const normalizedProjectName = projectName.replace(/-/g, "_");
  const mdkProjectName = `${normalizedProjectName}_mdk`;
  const mdkProjectPath = path.join(projectPath, "app", mdkProjectName);

  const services = await getCapServicesInfo(projectPath);
  const entitySets = await extractEntitySetsFromCapProject(projectPath);

  return {
    isCapProject: true,
    projectName: mdkProjectName,
    mdkProjectPath,
    projectType: "headless",
    services,
    entitySets,
  };
}
