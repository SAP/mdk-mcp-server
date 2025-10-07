import { execSync } from "child_process";
import fs from "fs";
import * as path from "path";
import xml2js from "xml2js";
import { fileURLToPath } from "url";

// Get the directory where this module is located, then go up to find project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Security: Define allowed base directories for file operations
const ALLOWED_BASE_DIRECTORIES = [
  process.cwd(), // Current working directory
  projectRoot, // Project root directory
  // Add more allowed directories as needed
];

// Security: Define allowed commands with their permitted arguments
const ALLOWED_COMMANDS = {
  yo: {
    executable: "yo",
    allowedArgs: ["--dataFile", "--force", "--tool"],
  },
  mdkcli: {
    executable: "mdkcli.js",
    allowedArgs: [
      "build",
      "deploy",
      "validate",
      "migrate",
      "--target",
      "--project",
      "--name",
      "--showqr",
    ],
  },
  mdk: {
    executable: "mdk.cmd",
    allowedArgs: [
      "build",
      "deploy",
      "validate",
      "migrate",
      "--target",
      "--project",
      "--name",
      "--showqr",
    ],
  },
  open: {
    executable: "open",
    allowedArgs: [], // Will be validated separately for file paths
  },
};

/**
 * Security function to validate and sanitize file paths
 */
export function validateAndSanitizePath(inputPath: string): string {
  if (!inputPath || typeof inputPath !== "string") {
    throw new Error("Invalid path: Path must be a non-empty string");
  }

  // Remove any null bytes or control characters
  // eslint-disable-next-line no-control-regex
  const sanitized = inputPath.replace(/[\u0000-\u001f\u007f-\u009f]/g, "");

  // Resolve the path to prevent directory traversal
  const resolvedPath = path.resolve(sanitized);

  // Check if the resolved path is within allowed directories
  const isAllowed = ALLOWED_BASE_DIRECTORIES.some(allowedDir => {
    const normalizedAllowed = path.resolve(allowedDir);
    return (
      resolvedPath.startsWith(normalizedAllowed + path.sep) ||
      resolvedPath === normalizedAllowed
    );
  });

  if (!isAllowed) {
    throw new Error(
      `Access denied: Path '${inputPath}' is outside allowed directories`
    );
  }

  // Additional checks for suspicious patterns
  if (sanitized.includes("..") || sanitized.includes("~")) {
    throw new Error(
      "Invalid path: Path contains potentially dangerous characters"
    );
  }

  return resolvedPath;
}

/**
 * Security function to validate command arguments
 */
function validateCommandArgs(command: string, args: string[]): void {
  // Extract the base command name
  const baseCommand = path.basename(command).replace(/\.(js|cmd)$/, "");

  const allowedCommand = Object.values(ALLOWED_COMMANDS).find(
    cmd =>
      cmd.executable === baseCommand ||
      cmd.executable === path.basename(command)
  );

  if (!allowedCommand) {
    throw new Error(`Command not allowed: ${baseCommand}`);
  }

  // Validate each argument
  for (const arg of args) {
    // Check for command injection patterns
    if (/[;&|`$(){}[\]<>]/.test(arg)) {
      throw new Error(
        `Invalid argument: '${arg}' contains potentially dangerous characters`
      );
    }

    // For path arguments, validate they are safe
    if (arg.startsWith("./") || arg.startsWith("../")) {
      try {
        validateAndSanitizePath(arg);
      } catch {
        throw new Error(`Invalid path argument: ${arg}`);
      }
    }
  }
}

export function runCommand(
  command: string,
  options: { cwd?: string; timeout?: number } = {}
): string {
  try {
    // Parse command and arguments
    const parts = command.trim().split(/\s+/);
    const baseCommand = parts[0];
    const args = parts.slice(1);

    // Security: Validate the command and arguments
    validateCommandArgs(baseCommand, args);

    // Security: Validate working directory if provided
    let safeCwd = options.cwd;
    if (safeCwd) {
      safeCwd = validateAndSanitizePath(safeCwd);
    }

    // Determine timeout based on command type
    let commandTimeout = options.timeout || 30000; // Default 30 seconds

    // Increase timeout for deployment and build commands that may take longer
    if (command.includes("deploy") || command.includes("build")) {
      commandTimeout = options.timeout || 120000; // 2 minutes for deploy/build commands
    }

    const output = execSync(command, {
      cwd: safeCwd,
      env: process.env,
      stdio: "pipe",
      encoding: "utf-8",
      timeout: commandTimeout,
    });
    return output;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Command failed: ${command}\n${errorMessage}`);
  }
}

export function geServiceMetadataJson(filePath: string): unknown {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getModulePath(modueName: string): Promise<string> {
  try {
    // Only check local node_modules for @sap/mdk-tools or @sap/generator-mdk in this server
    const localModulePath = path.join(
      projectRoot,
      "node_modules",
      "@sap",
      modueName
    );

    if (fs.existsSync(localModulePath)) {
      // Look for the mdk binary in the package
      const binPath = path.join(localModulePath, "lib");
      const binPathCmd = path.join(localModulePath, "bin");

      if (fs.existsSync(binPath)) {
        return binPath;
      } else if (fs.existsSync(binPathCmd)) {
        return binPathCmd;
      }

      // If no bin directory, return the package root
      return localModulePath;
    }

    // If no local MDK module found, return empty string
    return "";
  } catch (err) {
    console.error("Error finding local MDK module path:", err);
    // Return empty string instead of throwing error to allow commands to continue
    return "";
  }
}

export async function generateTemplateBasedMetadata(
  oDataEntitySetsString: string,
  templateType: string,
  projectPath: string,
  offline: boolean,
  entity: boolean
): Promise<string> {
  const oDataEntitySets = oDataEntitySetsString.split(",");
  const oJson = {
    template: templateType,
    entitySets: oDataEntitySets,
    offline: offline,
  };

  // Load service metadata
  const filePath = path.join(projectPath, ".service.metadata");
  const serviceMetadataObj = geServiceMetadataJson(filePath);
  let destinations: Array<{
    name: string;
    relativeUrl: string;
    metadata: { odataContent: string };
    type: string;
  }> = [];
  let appId = "";
  let edmxPath = "";

  if (!serviceMetadataObj) {
    if (entity) {
      // Fallback: Get data from .project.json and Services folder
      try {
        // Get appId from MobileService.AppId in .project.json
        const fallbackAppId = getMobileServiceAppNameWithFallback(projectPath);
        if (fallbackAppId) {
          appId = fallbackAppId;
        }

        // Get destination name and edmxPath from .project.json and Services folder
        const serviceData = getServiceDataWithFallback(projectPath);
        if (serviceData) {
          edmxPath = serviceData.serviceData;

          // Extract destination name from .project.json
          const projectJsonPath = path.join(projectPath, ".project.json");
          if (fs.existsSync(projectJsonPath)) {
            const projectJsonContent = fs.readFileSync(
              projectJsonPath,
              "utf-8"
            );
            const projectConfig = JSON.parse(projectJsonContent);

            let destinationName: string | null = null;
            if (projectConfig.CF?.Deploy?.Destination) {
              if (Array.isArray(projectConfig.CF.Deploy.Destination)) {
                // Array format: CF.Deploy.Destination[].MDK
                const destination = projectConfig.CF.Deploy.Destination[0];
                if (destination?.MDK) {
                  destinationName = destination.MDK;
                }
              } else if (projectConfig.CF.Deploy.Destination.MDK) {
                // Object format: CF.Deploy.Destination.MDK
                destinationName = projectConfig.CF.Deploy.Destination.MDK;
              }
            }

            if (destinationName && edmxPath) {
              destinations = [
                {
                  name: destinationName,
                  relativeUrl: "",
                  metadata: {
                    odataContent: edmxPath,
                  },
                  type: "Mobile",
                },
              ];
            }
          }
        }

        // If we still don't have the required data, return empty
        if (!appId || destinations.length === 0) {
          return "";
        }
      } catch (error) {
        console.error("Error reading fallback configuration:", error);
        return "";
      }
    }
  } else {
    const metadata = serviceMetadataObj as {
      mobile: {
        app: string;
        destinations: Array<{
          name: string;
          relativeUrl: string;
          metadata: { odataContent: string };
          type: string;
        }>;
      };
    };
    appId = metadata["mobile"]["app"];
    destinations = metadata["mobile"]["destinations"];
  }
  // Initialize project configuration object
  const oConfig: {
    services: unknown[];
    projectName?: string;
    target?: string;
    type?: string;
    newEntity?: boolean;
    appId?: unknown;
    template?: string;
  } = { services: [] };

  // Extract project name from path
  const paths = projectPath.split("/");
  oConfig.projectName = paths.pop();
  oConfig.target = paths.join("/");
  oConfig.type = "headless";
  oConfig.newEntity = entity;

  if (serviceMetadataObj || (appId && destinations.length > 0)) {
    // Set mobile app configuration
    oConfig.appId = appId;

    // Process destinations and entity sets
    let entitySets: string[] = [];
    let entitySetsService: string[] = [];
    const entitySetsServices: string[] = [];

    // Iterate through destinations to build services
    for (let i = 0; i < destinations.length; i++) {
      entitySetsService = [];

      // Get entity sets from OData metadata
      entitySets = await getEntitySetsFromODataString(
        destinations[i]["metadata"]["odataContent"]
      );

      // Filter and collect relevant entity sets
      for (let j = 0; j < oJson.entitySets.length; j++) {
        const currentEntitySet: string = oJson.entitySets[j];

        if (
          entitySets.includes(currentEntitySet) &&
          !entitySetsServices.includes(currentEntitySet)
        ) {
          entitySetsServices.push(currentEntitySet);
          entitySetsService.push(currentEntitySet);
        }
      }

      // Create service configuration object
      const oService = {
        name: destinations[i]["name"].replaceAll(".", "_"),
        path: "/",
        destination: destinations[i]["name"],
        edmxPath: destinations[i]["metadata"]["odataContent"],
        entitySets: entitySetsService,
        offline: oJson.offline,
      };

      oConfig.services.push(oService);
    }

    // Handle empty destinations case
    if (destinations.length === 0 && !entity) {
      oJson.template = "empty";
    }
  } else {
    oJson.template = "empty";
  }

  // Set template type
  oConfig.template = oJson.template;

  // Write configuration to file
  fs.writeFileSync(
    path.join(projectPath, "headless.json"),
    JSON.stringify(oConfig, null, 2)
  );

  // Prepare MDK generation command
  const mdkToolsPath = await getModulePath("mdk-tools");
  const mdkGeneratorPath = await getModulePath("generator-mdk");

  let script = `yo ${mdkGeneratorPath}/generators/app/index.js --dataFile ${projectPath}/headless.json --force`;

  if (mdkToolsPath) {
    const mdkBinary = path.join(
      mdkToolsPath,
      process.platform === "win32" ? "mdk.cmd" : "mdkcli.js"
    );
    script += ` --tool ${mdkBinary}`;
  }
  return script;
}

async function getEntitySetsFromODataString(data: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(data, (error: unknown, result: unknown) => {
      if (error) {
        reject(error);
      }

      const parsedResult = result as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (parsedResult["edmx:Edmx"]["edmx:DataServices"]) {
        const entitySets =
          parsedResult["edmx:Edmx"]["edmx:DataServices"][0].Schema[0]
            .EntityContainer[0].EntitySet;
        const simSets = entitySets.map((_set: { $: { Name: string } }) => {
          return _set.$.Name;
        });
        resolve(simSets);
      } else {
        reject("OData not supported yet");
      }
    });
  });
}

/**
 * Enhanced function to get project name with fallback logic
 * If .service.metadata is not available, get mobile service app name from MobileService.AppId in .project.json
 */
export function getMobileServiceAppNameWithFallback(
  projectPath: string
): string | null {
  try {
    // First, try to read from .service.metadata (primary approach)
    const serviceMetadataPath = path.join(projectPath, ".service.metadata");

    if (fs.existsSync(serviceMetadataPath)) {
      const serviceMetadataObj = geServiceMetadataJson(serviceMetadataPath);
      if (serviceMetadataObj && serviceMetadataObj["mobile"]?.["app"]) {
        return serviceMetadataObj["mobile"]["app"] as string;
      }
    }

    // Fallback: Read from .project.json
    const projectJsonPath = path.join(projectPath, ".project.json");

    if (fs.existsSync(projectJsonPath)) {
      const projectJsonContent = fs.readFileSync(projectJsonPath, "utf-8");
      const projectConfig = JSON.parse(projectJsonContent);

      // Get project name from MobileService.AppId
      if (projectConfig.MobileService?.AppId) {
        return projectConfig.MobileService.AppId as string;
      }
    }

    return null;
  } catch (error) {
    console.error("Error in getProjectNameWithFallback:", error);
    return null;
  }
}

/**
 * Enhanced function to get service metadata with fallback logic
 * If .service.metadata is not available, get destination name from .project.json
 * and read SERVICE_DATA from {destination name}.xml file in Services folder
 */
export function getServiceDataWithFallback(
  projectPath: string
): { serviceData: string; servicePath: string } | null {
  try {
    // First, try to read from .service.metadata (primary approach)
    const serviceMetadataPath = path.join(projectPath, ".service.metadata");

    if (fs.existsSync(serviceMetadataPath)) {
      const serviceMetadataObj = geServiceMetadataJson(serviceMetadataPath);
      if (
        serviceMetadataObj &&
        serviceMetadataObj["mobile"]?.["destinations"]?.[0]
      ) {
        const destination = serviceMetadataObj["mobile"]["destinations"][0];
        const serviceData = destination.metadata.odataContent;
        const servicePath = path.join(
          projectPath,
          "Services",
          destination.name + ".service"
        );
        return { serviceData, servicePath };
      }
    }

    // Fallback: Read from .project.json and Services folder
    const projectJsonPath = path.join(projectPath, ".project.json");

    if (fs.existsSync(projectJsonPath)) {
      const projectJsonContent = fs.readFileSync(projectJsonPath, "utf-8");
      const projectConfig = JSON.parse(projectJsonContent);

      // Get destination name from CF.Deploy.Destination[].MDK or CF.Deploy.Destination.MDK
      let destinationName: string | null = null;

      if (projectConfig.CF?.Deploy?.Destination) {
        if (Array.isArray(projectConfig.CF.Deploy.Destination)) {
          // Array format: CF.Deploy.Destination[].MDK
          const destination = projectConfig.CF.Deploy.Destination[0];
          if (destination?.MDK) {
            destinationName = destination.MDK;
          }
        } else if (projectConfig.CF.Deploy.Destination.MDK) {
          // Object format: CF.Deploy.Destination.MDK
          destinationName = projectConfig.CF.Deploy.Destination.MDK;
        }
      }

      if (destinationName) {
        // Try to read the XML file from Services folder
        const xmlFilePath = path.join(
          projectPath,
          "Services",
          `.${destinationName.replaceAll(".", "_")}.xml`
        );

        if (fs.existsSync(xmlFilePath)) {
          const serviceData = fs.readFileSync(xmlFilePath, "utf-8");
          const servicePath = path.join(
            projectPath,
            "Services",
            destinationName + ".service"
          );
          return { serviceData, servicePath };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error in getServiceDataWithFallback:", error);
    return null;
  }
}
