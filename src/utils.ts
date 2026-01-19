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
    executable: "mdkcli.cmd",
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
  start: {
    executable: "start",
    allowedArgs: [], // Will be validated separately for file paths
  },
  "xdg-open": {
    executable: "xdg-open",
    allowedArgs: [], // Will be validated separately for file paths
  },
};

// Security: DOS protection limits for XML/JSON parsing
const PARSING_LIMITS = {
  MAX_JSON_SIZE: 10 * 1024 * 1024, // 10MB max JSON size
  MAX_XML_SIZE: 10 * 1024 * 1024, // 10MB max XML size
  MAX_NESTING_DEPTH: 100, // Maximum nesting depth for JSON/XML
  PARSING_TIMEOUT: 30000, // 30 seconds timeout for parsing operations
  MAX_ENTITY_EXPANSION: 1000, // Maximum entity expansion count
};

/**
 * Security: Validate JSON size and structure before parsing
 */
function validateJsonSafety(content: string): void {
  // Check size limit
  if (content.length > PARSING_LIMITS.MAX_JSON_SIZE) {
    throw new Error(
      `JSON content exceeds maximum allowed size of ${PARSING_LIMITS.MAX_JSON_SIZE} bytes`
    );
  }

  // Check for excessive nesting by counting brackets
  let depth = 0;
  let maxDepth = 0;
  for (const char of content) {
    if (char === "{" || char === "[") {
      depth++;
      maxDepth = Math.max(maxDepth, depth);
      if (maxDepth > PARSING_LIMITS.MAX_NESTING_DEPTH) {
        throw new Error(
          `JSON nesting depth exceeds maximum allowed depth of ${PARSING_LIMITS.MAX_NESTING_DEPTH}`
        );
      }
    } else if (char === "}" || char === "]") {
      depth--;
    }
  }
}

/**
 * Security: Safe JSON parsing with size and depth limits
 */
export function safeJsonParse(content: string): unknown {
  validateJsonSafety(content);

  // Parse with timeout protection
  return new Promise((resolve, reject) => {
    const timeout = globalThis.setTimeout(() => {
      reject(
        new Error(
          `JSON parsing timeout after ${PARSING_LIMITS.PARSING_TIMEOUT}ms`
        )
      );
    }, PARSING_LIMITS.PARSING_TIMEOUT);

    try {
      const result = JSON.parse(content);
      globalThis.clearTimeout(timeout);
      resolve(result);
    } catch (error) {
      globalThis.clearTimeout(timeout);
      reject(error);
    }
  });
}

/**
 * Security: Validate XML size and structure before parsing
 */
function validateXmlSafety(content: string): void {
  // Check size limit
  if (content.length > PARSING_LIMITS.MAX_XML_SIZE) {
    throw new Error(
      `XML content exceeds maximum allowed size of ${PARSING_LIMITS.MAX_XML_SIZE} bytes`
    );
  }

  // Check for entity expansion attacks (billion laughs, etc.)
  const entityPattern = /<!ENTITY/gi;
  const entityMatches = content.match(entityPattern);
  if (
    entityMatches &&
    entityMatches.length > PARSING_LIMITS.MAX_ENTITY_EXPANSION
  ) {
    throw new Error(
      `XML contains excessive entity declarations (${entityMatches.length}), possible entity expansion attack`
    );
  }

  // Check for external entity references (XXE attack)
  if (content.includes("<!DOCTYPE") && content.includes("SYSTEM")) {
    throw new Error(
      "XML contains external entity references, which are not allowed for security reasons"
    );
  }

  // Check for excessive nesting
  let depth = 0;
  let maxDepth = 0;
  let inTag = false;
  let isClosingTag = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === "<") {
      inTag = true;
      isClosingTag = nextChar === "/";
    } else if (char === ">") {
      if (inTag) {
        if (isClosingTag) {
          depth--;
        } else if (content[i - 1] !== "/") {
          // Not a self-closing tag
          depth++;
          maxDepth = Math.max(maxDepth, depth);
          if (maxDepth > PARSING_LIMITS.MAX_NESTING_DEPTH) {
            throw new Error(
              `XML nesting depth exceeds maximum allowed depth of ${PARSING_LIMITS.MAX_NESTING_DEPTH}`
            );
          }
        }
      }
      inTag = false;
      isClosingTag = false;
    }
  }
}

/**
 * Security: Safe XML parsing with protection against XXE, entity expansion, and size limits
 */
export async function safeXmlParse(content: string): Promise<unknown> {
  validateXmlSafety(content);

  return new Promise((resolve, reject) => {
    const timeout = globalThis.setTimeout(() => {
      reject(
        new Error(
          `XML parsing timeout after ${PARSING_LIMITS.PARSING_TIMEOUT}ms`
        )
      );
    }, PARSING_LIMITS.PARSING_TIMEOUT);

    // Configure xml2js parser with security options
    const parser = new xml2js.Parser({
      // Disable external entity resolution (XXE protection)
      xmlns: false,
      // Limit attribute count
      attrkey: "$",
      // Disable normalization that could cause issues
      normalize: false,
      // Disable trimming to preserve exact content
      trim: false,
      // Explicitly disable entity expansion
      strict: true,
    });

    parser.parseString(content, (error: unknown, result: unknown) => {
      globalThis.clearTimeout(timeout);
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

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
  console.error(`[MDK MCP Server] Executing command: ${command}`);

  try {
    // Parse command and arguments, handling quoted arguments properly
    const parts = command.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    if (parts.length === 0) {
      throw new Error("Invalid command: Command cannot be empty");
    }

    const baseCommand = parts[0]?.replace(/"/g, "") || ""; // Remove quotes from command
    if (!baseCommand) {
      throw new Error("Invalid command: Command cannot be empty");
    }
    const args = parts.slice(1).map(arg => arg.replace(/"/g, "")); // Remove quotes from args

    // Security: Validate the command and arguments
    validateCommandArgs(baseCommand, args);

    // Security: Validate working directory if provided
    let safeCwd = options.cwd;
    if (safeCwd) {
      safeCwd = validateAndSanitizePath(safeCwd);
    }

    // Determine timeout based on command type
    let commandTimeout = options.timeout || 60000; // Default 60 seconds

    // Increase timeout for deployment and build commands that may take longer
    if (command.includes("deploy") || command.includes("build")) {
      commandTimeout = options.timeout || 300000; // 5 minutes for deploy/build commands
    }

    // Increase timeout for validation commands which can take a while for large projects
    // Set to 15 minutes for very large projects with thousands of files
    if (command.includes("validate")) {
      commandTimeout = options.timeout || 900000; // 15 minutes for validation commands
    }

    // Increase timeout for yo (yeoman) commands which can take a while
    if (command.includes("yo ") || baseCommand === "yo") {
      commandTimeout = options.timeout || 300000; // 5 minutes for yeoman generation
    }

    // For Windows, handle shell selection properly
    const execOptions: Record<string, unknown> = {
      cwd: safeCwd,
      env: process.env,
      stdio: "pipe",
      encoding: "utf-8",
      timeout: commandTimeout,
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large output (validation can produce lots of output)
    };

    // On Windows, ensure we use the correct shell for .cmd files
    if (process.platform === "win32") {
      if (baseCommand.endsWith(".cmd") || baseCommand === "yo") {
        execOptions.shell = true;
      }
    }

    const output = execSync(command, execOptions);
    console.error(`[MDK MCP Server] Command completed successfully`);
    return output.toString();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[MDK MCP Server] Command failed: ${errorMessage}`);
    throw new Error(`Command failed: ${command}\n${errorMessage}`);
  }
}

export async function geServiceMetadataJson(
  filePath: string
): Promise<unknown> {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    // Use safe JSON parsing with size and depth limits
    return await safeJsonParse(content);
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

      // Return binPath for Unix systems, binPathCmd for Windows
      if (process.platform === "win32") {
        // Windows: prefer bin directory, fallback to lib
        if (fs.existsSync(binPathCmd)) {
          return binPathCmd;
        } else if (fs.existsSync(binPath)) {
          return binPath;
        }
      } else {
        // Unix systems: prefer lib directory, fallback to bin
        if (fs.existsSync(binPath)) {
          return binPath;
        } else if (fs.existsSync(binPathCmd)) {
          return binPathCmd;
        }
      }

      // If no bin/lib directory, return the package root
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
  const serviceMetadataObj = await geServiceMetadataJson(filePath);
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
        const fallbackAppId = await getMobileServiceAppNameWithFallback(
          projectPath
        );
        if (fallbackAppId) {
          appId = fallbackAppId;
        }

        // Get destination name and edmxPath from .project.json and Services folder
        const serviceData = await getServiceDataWithFallback(projectPath);
        if (serviceData) {
          edmxPath = serviceData.serviceData;

          // Extract destination name from .project.json
          const projectJsonPath = path.join(projectPath, ".project.json");
          if (fs.existsSync(projectJsonPath)) {
            const projectJsonContent = fs.readFileSync(
              projectJsonPath,
              "utf-8"
            );

            const projectConfig = (await safeJsonParse(
              projectJsonContent
            )) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

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
  const paths = projectPath.split(path.sep);
  oConfig.projectName = paths.pop();
  oConfig.target = paths.join(path.sep);
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
  const configPath = path.join(projectPath, "headless.json");
  console.error(`[MDK MCP Server] Writing configuration file: ${configPath}`);
  fs.writeFileSync(configPath, JSON.stringify(oConfig, null, 2));
  console.error(`[MDK MCP Server] Configuration file written successfully`);

  // Prepare MDK generation command
  const mdkToolsPath = await getModulePath("mdk-tools");
  const mdkGeneratorPath = await getModulePath("generator-mdk");

  let script = `yo ${mdkGeneratorPath}/generators/app/index.js --dataFile ${projectPath}/headless.json --force`;

  if (mdkToolsPath) {
    const mdkBinary = path.join(
      mdkToolsPath,
      process.platform === "win32" ? "mdkcli.cmd" : "mdkcli.js"
    );
    script += ` --tool ${mdkBinary}`;
  }
  return script;
}

async function getEntitySetsFromODataString(data: string): Promise<string[]> {
  // Use safe XML parsing with security protections
  const result = await safeXmlParse(data);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedResult = result as any;
  if (parsedResult["edmx:Edmx"]?.["edmx:DataServices"]) {
    const dataServices = parsedResult["edmx:Edmx"]["edmx:DataServices"];
    if (
      Array.isArray(dataServices) &&
      dataServices[0]?.Schema?.[0]?.EntityContainer?.[0]?.EntitySet
    ) {
      const entitySets = dataServices[0].Schema[0].EntityContainer[0].EntitySet;
      const simSets = entitySets.map((_set: { $: { Name: string } }) => {
        return _set.$.Name;
      });
      return simSets;
    } else {
      throw new Error("OData not supported yet");
    }
  } else {
    throw new Error("OData not supported yet");
  }
}

/**
 * Enhanced function to get project name with fallback logic
 * If .service.metadata is not available, get mobile service app name from MobileService.AppId in .project.json
 */
export async function getMobileServiceAppNameWithFallback(
  projectPath: string
): Promise<string | null> {
  try {
    // First, try to read from .service.metadata (primary approach)
    const serviceMetadataPath = path.join(projectPath, ".service.metadata");

    if (fs.existsSync(serviceMetadataPath)) {
      const serviceMetadataObj = (await geServiceMetadataJson(
        serviceMetadataPath
      )) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (serviceMetadataObj && serviceMetadataObj["mobile"]?.["app"]) {
        return serviceMetadataObj["mobile"]["app"] as string;
      }
    }

    // Fallback: Read from .project.json
    const projectJsonPath = path.join(projectPath, ".project.json");

    if (fs.existsSync(projectJsonPath)) {
      const projectJsonContent = fs.readFileSync(projectJsonPath, "utf-8");
      const projectConfig = (await safeJsonParse(projectJsonContent)) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

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
 * @param projectPath - The path of the project root folder
 * @param oDataEntitySets - Optional comma-separated list of entity sets to filter
 */
export async function getServiceDataWithFallback(
  projectPath: string,
  oDataEntitySets?: string
): Promise<{ serviceData: string; servicePath: string } | null> {
  try {
    // First, try to read from .service.metadata (primary approach)
    const serviceMetadataPath = path.join(projectPath, ".service.metadata");

    if (fs.existsSync(serviceMetadataPath)) {
      const serviceMetadataObj = (await geServiceMetadataJson(
        serviceMetadataPath
      )) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (
        serviceMetadataObj &&
        serviceMetadataObj["mobile"]?.["destinations"]?.[0]
      ) {
        const destination = serviceMetadataObj["mobile"]["destinations"][0];
        let serviceData = destination.metadata.odataContent;

        // If oDataEntitySets is undefined, set serviceData to empty
        if (oDataEntitySets === undefined) {
          serviceData = "";
        } else if (oDataEntitySets) {
          // Filter service data if entity sets are specified
          serviceData = await filterServiceDataByEntitySets(
            serviceData,
            oDataEntitySets
          );
        }

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
      const projectConfig = (await safeJsonParse(projectJsonContent)) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

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
          let serviceData = fs.readFileSync(xmlFilePath, "utf-8");

          // If oDataEntitySets is undefined, set serviceData to empty
          if (oDataEntitySets === undefined) {
            serviceData = "";
          } else if (oDataEntitySets) {
            // Filter service data if entity sets are specified
            serviceData = await filterServiceDataByEntitySets(
              serviceData,
              oDataEntitySets
            );
          }

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

/**
 * Filter OData service metadata XML to only include specified entity sets
 * @param serviceData - The full OData service metadata XML
 * @param oDataEntitySets - Comma-separated list of entity sets to include
 * @returns Filtered service metadata XML
 */
async function filterServiceDataByEntitySets(
  serviceData: string,
  oDataEntitySets: string
): Promise<string> {
  try {
    // Parse the entity sets list
    const entitySetsToInclude = oDataEntitySets
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (entitySetsToInclude.length === 0) {
      return serviceData;
    }

    // Parse the XML
    const result = await safeXmlParse(serviceData);
    const parsedResult = result as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    // Navigate to EntityContainer
    if (parsedResult["edmx:Edmx"]?.["edmx:DataServices"]) {
      const dataServices = parsedResult["edmx:Edmx"]["edmx:DataServices"];
      if (
        Array.isArray(dataServices) &&
        dataServices[0]?.Schema?.[0]?.EntityContainer?.[0]?.EntitySet
      ) {
        const entitySets =
          dataServices[0].Schema[0].EntityContainer[0].EntitySet;

        // Filter entity sets to only include specified ones
        const filteredEntitySets = entitySets.filter(
          (entitySet: { $: { Name: string } }) => {
            return entitySetsToInclude.includes(entitySet.$.Name);
          }
        );

        // Update the entity sets in the parsed structure
        dataServices[0].Schema[0].EntityContainer[0].EntitySet =
          filteredEntitySets;

        // Also filter EntityTypes to only include those referenced by the filtered entity sets
        const entityTypeNames = new Set(
          filteredEntitySets.map((es: { $: { EntityType: string } }) => {
            // EntityType is in format "Namespace.TypeName", we need just "TypeName"
            const fullType = es.$.EntityType;
            return fullType.includes(".")
              ? fullType.split(".").pop()
              : fullType;
          })
        );

        // Filter EntityTypes
        if (dataServices[0].Schema?.[0]?.EntityType) {
          const entityTypes = dataServices[0].Schema[0].EntityType;
          const filteredEntityTypes = entityTypes.filter(
            (et: { $: { Name: string } }) => {
              return entityTypeNames.has(et.$.Name);
            }
          );
          dataServices[0].Schema[0].EntityType = filteredEntityTypes;
        }

        // Convert back to XML
        const builder = new xml2js.Builder({
          xmldec: { version: "1.0", encoding: "UTF-8" },
          renderOpts: { pretty: true, indent: "  " },
        });
        return builder.buildObject(parsedResult);
      }
    }

    // If we couldn't filter, return original
    return serviceData;
  } catch (error) {
    console.error("Error filtering service data:", error);
    // Return original data if filtering fails
    return serviceData;
  }
}

/**
 * Get server configuration from package.json with command line argument override
 * @returns MDK server configuration object with defaults
 */
export async function getServerConfig(): Promise<{
  schemaVersion: string;
}> {
  try {
    // Check for schema version in command line arguments first
    const args = process.argv.slice(2);
    let schemaVersionFromArgs: string | null = null;

    // Look for --schema-version argument
    const schemaVersionIndex = args.findIndex(
      arg => arg === "--schema-version"
    );
    if (schemaVersionIndex !== -1 && schemaVersionIndex + 1 < args.length) {
      schemaVersionFromArgs = args[schemaVersionIndex + 1];
    }

    // Also check for --schema-version=value format
    const schemaVersionArg = args.find(arg =>
      arg.startsWith("--schema-version=")
    );
    if (schemaVersionArg) {
      schemaVersionFromArgs = schemaVersionArg.split("=")[1];
    }

    // Validate schema version if provided via command line
    if (schemaVersionFromArgs) {
      const availableVersions = ["24.7", "24.11", "25.6", "25.9"];
      if (!availableVersions.includes(schemaVersionFromArgs)) {
        console.warn(
          `Warning: Invalid schema version '${schemaVersionFromArgs}' provided via command line. ` +
            `Available versions: ${availableVersions.join(
              ", "
            )}. Using default from package.json.`
        );
        schemaVersionFromArgs = null;
      }
    }

    // Read configuration from package.json
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = (await safeJsonParse(
      fs.readFileSync(packageJsonPath, "utf-8")
    )) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    // Use command line argument if valid, otherwise use package.json config
    const schemaVersion =
      schemaVersionFromArgs || packageJson.mdkConfig?.schemaVersion || "25.9";

    return {
      schemaVersion,
    };
  } catch (error) {
    console.error(
      "Error reading server configuration from package.json:",
      error
    );
    // Return default configuration on error
    return {
      schemaVersion: "25.9",
    };
  }
}

/**
 * Get schema version from _SchemaVersion property in Application.app file
 * @param projectPath - The path of the project root folder
 * @returns Schema version as string, uses server default if not found
 */
export async function getSchemaVersion(projectPath: string): Promise<string> {
  try {
    const applicationAppPath = path.join(projectPath, "Application.app");

    if (fs.existsSync(applicationAppPath)) {
      const applicationContent = fs.readFileSync(applicationAppPath, "utf-8");
      const applicationConfig = (await safeJsonParse(
        applicationContent
      )) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      // Check if _SchemaVersion property exists
      if (applicationConfig._SchemaVersion) {
        return applicationConfig._SchemaVersion as string;
      }
    }

    return "25.9";
  } catch (error) {
    console.error("Error reading schema version from Application.app:", error);
    // Return server default value on error
    return "25.9";
  }
}
