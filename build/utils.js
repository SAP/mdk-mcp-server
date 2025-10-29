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
export function validateAndSanitizePath(inputPath) {
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
        return (resolvedPath.startsWith(normalizedAllowed + path.sep) ||
            resolvedPath === normalizedAllowed);
    });
    if (!isAllowed) {
        throw new Error(`Access denied: Path '${inputPath}' is outside allowed directories`);
    }
    // Additional checks for suspicious patterns
    if (sanitized.includes("..") || sanitized.includes("~")) {
        throw new Error("Invalid path: Path contains potentially dangerous characters");
    }
    return resolvedPath;
}
/**
 * Security function to validate command arguments
 */
function validateCommandArgs(command, args) {
    // Extract the base command name
    const baseCommand = path.basename(command).replace(/\.(js|cmd)$/, "");
    const allowedCommand = Object.values(ALLOWED_COMMANDS).find(cmd => cmd.executable === baseCommand ||
        cmd.executable === path.basename(command));
    if (!allowedCommand) {
        throw new Error(`Command not allowed: ${baseCommand}`);
    }
    // Validate each argument
    for (const arg of args) {
        // Check for command injection patterns
        if (/[;&|`$(){}[\]<>]/.test(arg)) {
            throw new Error(`Invalid argument: '${arg}' contains potentially dangerous characters`);
        }
        // For path arguments, validate they are safe
        if (arg.startsWith("./") || arg.startsWith("../")) {
            try {
                validateAndSanitizePath(arg);
            }
            catch {
                throw new Error(`Invalid path argument: ${arg}`);
            }
        }
    }
}
export function runCommand(command, options = {}) {
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
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        throw new Error(`Command failed: ${command}\n${errorMessage}`);
    }
}
export function geServiceMetadataJson(filePath) {
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(content);
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
export async function getModulePath(modueName) {
    try {
        // Only check local node_modules for @sap/mdk-tools or @sap/generator-mdk in this server
        const localModulePath = path.join(projectRoot, "node_modules", "@sap", modueName);
        if (fs.existsSync(localModulePath)) {
            // Look for the mdk binary in the package
            const binPath = path.join(localModulePath, "lib");
            const binPathCmd = path.join(localModulePath, "bin");
            if (fs.existsSync(binPath)) {
                return binPath;
            }
            else if (fs.existsSync(binPathCmd)) {
                return binPathCmd;
            }
            // If no bin directory, return the package root
            return localModulePath;
        }
        // If no local MDK module found, return empty string
        return "";
    }
    catch (err) {
        console.error("Error finding local MDK module path:", err);
        // Return empty string instead of throwing error to allow commands to continue
        return "";
    }
}
export async function generateTemplateBasedMetadata(oDataEntitySetsString, templateType, projectPath, offline, entity) {
    const oDataEntitySets = oDataEntitySetsString.split(",");
    const oJson = {
        template: templateType,
        entitySets: oDataEntitySets,
        offline: offline,
    };
    // Load service metadata
    const filePath = path.join(projectPath, ".service.metadata");
    const serviceMetadataObj = geServiceMetadataJson(filePath);
    let destinations = [];
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
                        const projectJsonContent = fs.readFileSync(projectJsonPath, "utf-8");
                        const projectConfig = JSON.parse(projectJsonContent);
                        let destinationName = null;
                        if (projectConfig.CF?.Deploy?.Destination) {
                            if (Array.isArray(projectConfig.CF.Deploy.Destination)) {
                                // Array format: CF.Deploy.Destination[].MDK
                                const destination = projectConfig.CF.Deploy.Destination[0];
                                if (destination?.MDK) {
                                    destinationName = destination.MDK;
                                }
                            }
                            else if (projectConfig.CF.Deploy.Destination.MDK) {
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
            }
            catch (error) {
                console.error("Error reading fallback configuration:", error);
                return "";
            }
        }
    }
    else {
        const metadata = serviceMetadataObj;
        appId = metadata["mobile"]["app"];
        destinations = metadata["mobile"]["destinations"];
    }
    // Initialize project configuration object
    const oConfig = { services: [] };
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
        let entitySets = [];
        let entitySetsService = [];
        const entitySetsServices = [];
        // Iterate through destinations to build services
        for (let i = 0; i < destinations.length; i++) {
            entitySetsService = [];
            // Get entity sets from OData metadata
            entitySets = await getEntitySetsFromODataString(destinations[i]["metadata"]["odataContent"]);
            // Filter and collect relevant entity sets
            for (let j = 0; j < oJson.entitySets.length; j++) {
                const currentEntitySet = oJson.entitySets[j];
                if (entitySets.includes(currentEntitySet) &&
                    !entitySetsServices.includes(currentEntitySet)) {
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
    }
    else {
        oJson.template = "empty";
    }
    // Set template type
    oConfig.template = oJson.template;
    // Write configuration to file
    fs.writeFileSync(path.join(projectPath, "headless.json"), JSON.stringify(oConfig, null, 2));
    // Prepare MDK generation command
    const mdkToolsPath = await getModulePath("mdk-tools");
    const mdkGeneratorPath = await getModulePath("generator-mdk");
    let script = `yo ${mdkGeneratorPath}/generators/app/index.js --dataFile ${projectPath}/headless.json --force`;
    if (mdkToolsPath) {
        const mdkBinary = path.join(mdkToolsPath, process.platform === "win32" ? "mdk.cmd" : "mdkcli.js");
        script += ` --tool ${mdkBinary}`;
    }
    return script;
}
async function getEntitySetsFromODataString(data) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(data, (error, result) => {
            if (error) {
                reject(error);
            }
            const parsedResult = result; // eslint-disable-line @typescript-eslint/no-explicit-any
            if (parsedResult["edmx:Edmx"]["edmx:DataServices"]) {
                const entitySets = parsedResult["edmx:Edmx"]["edmx:DataServices"][0].Schema[0]
                    .EntityContainer[0].EntitySet;
                const simSets = entitySets.map((_set) => {
                    return _set.$.Name;
                });
                resolve(simSets);
            }
            else {
                reject("OData not supported yet");
            }
        });
    });
}
/**
 * Enhanced function to get project name with fallback logic
 * If .service.metadata is not available, get mobile service app name from MobileService.AppId in .project.json
 */
export function getMobileServiceAppNameWithFallback(projectPath) {
    try {
        // First, try to read from .service.metadata (primary approach)
        const serviceMetadataPath = path.join(projectPath, ".service.metadata");
        if (fs.existsSync(serviceMetadataPath)) {
            const serviceMetadataObj = geServiceMetadataJson(serviceMetadataPath);
            if (serviceMetadataObj && serviceMetadataObj["mobile"]?.["app"]) {
                return serviceMetadataObj["mobile"]["app"];
            }
        }
        // Fallback: Read from .project.json
        const projectJsonPath = path.join(projectPath, ".project.json");
        if (fs.existsSync(projectJsonPath)) {
            const projectJsonContent = fs.readFileSync(projectJsonPath, "utf-8");
            const projectConfig = JSON.parse(projectJsonContent);
            // Get project name from MobileService.AppId
            if (projectConfig.MobileService?.AppId) {
                return projectConfig.MobileService.AppId;
            }
        }
        return null;
    }
    catch (error) {
        console.error("Error in getProjectNameWithFallback:", error);
        return null;
    }
}
/**
 * Enhanced function to get service metadata with fallback logic
 * If .service.metadata is not available, get destination name from .project.json
 * and read SERVICE_DATA from {destination name}.xml file in Services folder
 */
export function getServiceDataWithFallback(projectPath) {
    try {
        // First, try to read from .service.metadata (primary approach)
        const serviceMetadataPath = path.join(projectPath, ".service.metadata");
        if (fs.existsSync(serviceMetadataPath)) {
            const serviceMetadataObj = geServiceMetadataJson(serviceMetadataPath);
            if (serviceMetadataObj &&
                serviceMetadataObj["mobile"]?.["destinations"]?.[0]) {
                const destination = serviceMetadataObj["mobile"]["destinations"][0];
                const serviceData = destination.metadata.odataContent;
                const servicePath = path.join(projectPath, "Services", destination.name + ".service");
                return { serviceData, servicePath };
            }
        }
        // Fallback: Read from .project.json and Services folder
        const projectJsonPath = path.join(projectPath, ".project.json");
        if (fs.existsSync(projectJsonPath)) {
            const projectJsonContent = fs.readFileSync(projectJsonPath, "utf-8");
            const projectConfig = JSON.parse(projectJsonContent);
            // Get destination name from CF.Deploy.Destination[].MDK or CF.Deploy.Destination.MDK
            let destinationName = null;
            if (projectConfig.CF?.Deploy?.Destination) {
                if (Array.isArray(projectConfig.CF.Deploy.Destination)) {
                    // Array format: CF.Deploy.Destination[].MDK
                    const destination = projectConfig.CF.Deploy.Destination[0];
                    if (destination?.MDK) {
                        destinationName = destination.MDK;
                    }
                }
                else if (projectConfig.CF.Deploy.Destination.MDK) {
                    // Object format: CF.Deploy.Destination.MDK
                    destinationName = projectConfig.CF.Deploy.Destination.MDK;
                }
            }
            if (destinationName) {
                // Try to read the XML file from Services folder
                const xmlFilePath = path.join(projectPath, "Services", `.${destinationName.replaceAll(".", "_")}.xml`);
                if (fs.existsSync(xmlFilePath)) {
                    const serviceData = fs.readFileSync(xmlFilePath, "utf-8");
                    const servicePath = path.join(projectPath, "Services", destinationName + ".service");
                    return { serviceData, servicePath };
                }
            }
        }
        return null;
    }
    catch (error) {
        console.error("Error in getServiceDataWithFallback:", error);
        return null;
    }
}
/**
 * Get server configuration from package.json with command line argument override
 * @returns MDK server configuration object with defaults
 */
export function getServerConfig() {
    try {
        // Check for schema version in command line arguments first
        const args = process.argv.slice(2);
        let schemaVersionFromArgs = null;
        // Look for --schema-version argument
        const schemaVersionIndex = args.findIndex(arg => arg === "--schema-version");
        if (schemaVersionIndex !== -1 && schemaVersionIndex + 1 < args.length) {
            schemaVersionFromArgs = args[schemaVersionIndex + 1];
        }
        // Also check for --schema-version=value format
        const schemaVersionArg = args.find(arg => arg.startsWith("--schema-version="));
        if (schemaVersionArg) {
            schemaVersionFromArgs = schemaVersionArg.split("=")[1];
        }
        // Validate schema version if provided via command line
        if (schemaVersionFromArgs) {
            const availableVersions = ["24.7", "24.11", "25.6", "25.9"];
            if (!availableVersions.includes(schemaVersionFromArgs)) {
                console.warn(`Warning: Invalid schema version '${schemaVersionFromArgs}' provided via command line. ` +
                    `Available versions: ${availableVersions.join(", ")}. Using default from package.json.`);
                schemaVersionFromArgs = null;
            }
        }
        // Read configuration from package.json
        const packageJsonPath = path.join(projectRoot, "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        // Use command line argument if valid, otherwise use package.json config
        const schemaVersion = schemaVersionFromArgs || packageJson.mdkConfig?.schemaVersion || "25.9";
        return {
            schemaVersion,
        };
    }
    catch (error) {
        console.error("Error reading server configuration from package.json:", error);
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
export function getSchemaVersion(projectPath) {
    try {
        const applicationAppPath = path.join(projectPath, "Application.app");
        if (fs.existsSync(applicationAppPath)) {
            const applicationContent = fs.readFileSync(applicationAppPath, "utf-8");
            const applicationConfig = JSON.parse(applicationContent);
            // Check if _SchemaVersion property exists
            if (applicationConfig._SchemaVersion) {
                return applicationConfig._SchemaVersion;
            }
        }
        return "25.9";
    }
    catch (error) {
        console.error("Error reading schema version from Application.app:", error);
        // Return server default value on error
        return "25.9";
    }
}
