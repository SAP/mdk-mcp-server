import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListPromptsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { runCommand, getModulePath, generateTemplateBasedMetadata, getServiceDataWithFallback, getMobileServiceAppNameWithFallback, } from "./utils.js";
import { validateToolArguments } from "./validation.js";
import path from "path";
import fs from "fs";
import { retrieveAndStore, search, searchNames, getDocuments, printResults, } from "./vector.js";
import { fileURLToPath } from "url";
// Get the directory where this module is located, then go up to find project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
let filenameList = [];
let contentList = [];
const server = new Server({
    name: "mdk-mcp",
    version: "0.1.0",
}, {
    capabilities: {
        tools: {},
        prompts: {},
    },
});
/**
 * Handler that lists available tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "mdk-gen-project",
                description: "Generates a new MDK project in the current directory.",
                inputSchema: {
                    type: "object",
                    properties: {
                        folderRootPath: {
                            type: "string",
                            description: "The path of the current project root folder.",
                        },
                        templateType: {
                            type: "string",
                            enum: ["crud", "list detail", "base"],
                            description: "The type of the template to be used.",
                        },
                        oDataEntitySets: {
                            type: "string",
                            description: "The OData entity sets are relevant to the user prompt, separated by commas.",
                        },
                        offline: {
                            type: "boolean",
                            description: "Whether to generate the project in offline mode, set to false unless offline is explicitly specified.",
                        },
                    },
                    required: [
                        "folderRootPath",
                        "templateType",
                        "oDataEntitySets",
                        "offline",
                    ],
                },
            },
            {
                name: "mdk-gen-i18n",
                description: "Returns a prompt to be used for generating i18n files for the MDK application. You can describe texts, labels, messages.",
                inputSchema: {
                    type: "object",
                    properties: {
                        folderRootPath: {
                            type: "string",
                            description: "The path of the current project root folder.",
                        },
                    },
                    required: ["folderRootPath"],
                },
            },
            {
                name: "mdk-gen-databinding-page",
                description: "Returns a prompt to be used for generating a databinding-enabled MDK page. Using the prompt, a .page file is created that describes the page layout, controls and data bindings.",
                inputSchema: {
                    type: "object",
                    properties: {
                        folderRootPath: {
                            type: "string",
                            description: "The path of the current project root folder.",
                        },
                        controlType: {
                            type: "string",
                            enum: [
                                "ObjectTable",
                                "FormCell",
                                "KeyValue",
                                "ObjectHeader",
                                "ContactTable",
                                "SimplePropertyCollection",
                                "ObjectCard",
                                "DataTable",
                                "KPIHeader",
                                "ProfileHeader",
                                "ObjectCollection",
                                "Timeline",
                                "TimelinePreview",
                                "Calendar",
                            ],
                            description: "The type of the control to be used in the MDK page.",
                        },
                    },
                    required: ["folderRootPath", "controlType"],
                },
            },
            {
                name: "mdk-gen-layout-page",
                description: "Generates a layout-based MDK page. You can describe the page layout, controls. It saves the response to `.page` file.",
                inputSchema: {
                    type: "object",
                    properties: {
                        folderRootPath: {
                            type: "string",
                            description: "The path of the current project root folder.",
                        },
                        layoutType: {
                            type: "string",
                            enum: [
                                "Section",
                                "BottomNavigation",
                                "FlexibleColumnLayout",
                                "SideDrawerNavigation",
                                "Tabs",
                                "Extension",
                            ],
                            description: "The type of the layout to be used in the MDK page.",
                        },
                    },
                    required: ["folderRootPath", "layoutType"],
                },
            },
            {
                name: "mdk-gen-entity",
                description: "Generates CRUD or List Detail template metadata for a new entity set.",
                inputSchema: {
                    type: "object",
                    properties: {
                        folderRootPath: {
                            type: "string",
                            description: "The path of the current project root folder.",
                        },
                        templateType: {
                            type: "string",
                            enum: ["list detail", "crud"],
                            description: "The type of the entity template to be used.",
                        },
                        oDataEntitySets: {
                            type: "string",
                            description: "The OData entity sets are relevant to the user prompt, separated by commas.",
                        },
                    },
                    required: ["folderRootPath", "templateType", "oDataEntitySets"],
                },
            },
            {
                name: "mdk-gen-action",
                description: "Returns a prompt to be used for generating an MDK action. Using the prompt, an `.action` file will be created that describes the action type and data bindings.",
                inputSchema: {
                    type: "object",
                    properties: {
                        folderRootPath: {
                            type: "string",
                            description: "The path of the current project root folder.",
                        },
                        actionType: {
                            type: "string",
                            enum: [
                                "CreateODataEntity",
                                "UpdateODataEntity",
                                "DeleteODataEntity",
                                "CreateODataMedia",
                                "InitializeOfflineOData",
                                "DownloadOfflineOData",
                                "UploadOfflineOData",
                                "CancelDownloadOfflineOData",
                                "CancelUploadOfflineOData",
                                "ClearOfflineOData",
                                "CloseOfflineOData",
                                "CreateODataRelatedEntity",
                                "CreateODataRelatedMedia",
                                "CreateODataService",
                                "DeleteODataMedia",
                                "DownloadMediaOData",
                                "LogMessage",
                                "Message",
                                "Navigation",
                                "OpenODataService",
                                "ProgressBanner",
                                "PushNotificationRegister",
                                "PushNotificationUnregister",
                                "ReadODataService",
                                "RemoveDefiningRequest",
                                "SendRequest",
                                "SetLevel",
                                "SetState",
                                "ToastMessage",
                                "UndoPendingChanges",
                                "UploadLog",
                                "UploadODataMedia",
                                "UploadStreamOData",
                                "ChatCompletion",
                                "PopoverMenu",
                                "CheckRequiredFields",
                                "ChangeSet",
                                "OpenDocument",
                                "Banner",
                                "Filter",
                            ],
                            description: "The type of the action.",
                        },
                    },
                    required: ["folderRootPath", "actionType"],
                },
            },
            {
                name: "mdk-project-operation",
                description: "Comprehensive MDK project management tool that handles build, deploy, validate, migrate, show QR code, and mobile app editor operations.",
                inputSchema: {
                    type: "object",
                    properties: {
                        folderRootPath: {
                            type: "string",
                            description: "The path of the current project root folder.",
                        },
                        operation: {
                            type: "string",
                            enum: [
                                "build",
                                "deploy",
                                "validate",
                                "migrate",
                                "show-qrcode",
                                "open-mobile-app-editor",
                            ],
                            description: "The operation to perform on the MDK project. Available operations:\n" +
                                "• build: Build an MDK project\n" +
                                "• deploy: Deploy an MDK project to the Mobile Services\n" +
                                "• validate: Validate an MDK project\n" +
                                "• migrate: Migrate an MDK project to the latest MDK version\n" +
                                "• show-qrcode: Show QR code for an MDK project\n" +
                                "• open-mobile-app-editor: Instruct how to open the Mobile App Editor to create .service.metadata file",
                        },
                    },
                    required: ["folderRootPath", "operation"],
                },
            },
            {
                name: "mdk-search-documentation",
                description: "Returns the top N results from MDK documentation by semantic search, sorted by relevance.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Search query string.",
                        },
                        N: {
                            type: "number",
                            description: "Number of results to return.",
                            default: 5,
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "mdk-get-component-documentation",
                description: "Returns the schema of an MDK component based on the name of the component.",
                inputSchema: {
                    type: "object",
                    properties: {
                        component_name: {
                            type: "string",
                            description: "Name of the component.",
                        },
                    },
                    required: ["component_name"],
                },
            },
            {
                name: "mdk-get-property-documentation",
                description: "Returns the documentation of a specific property of an MDK component.",
                inputSchema: {
                    type: "object",
                    properties: {
                        component_name: {
                            type: "string",
                            description: "Name of the component.",
                        },
                        property_name: {
                            type: "string",
                            description: "Name of the property.",
                        },
                    },
                    required: ["component_name", "property_name"],
                },
            },
            {
                name: "mdk-get-example",
                description: "Returns an example usage of an MDK component.",
                inputSchema: {
                    type: "object",
                    properties: {
                        component_name: {
                            type: "string",
                            description: "Name of the component.",
                        },
                    },
                    required: ["component_name"],
                },
            },
        ],
    };
});
/**
 * Handler for the tools.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "mdk-gen-project": {
            try {
                // Validate all arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-gen-project", request.params.arguments || {});
                const projectPath = validatedArgs.folderRootPath;
                const templateType = validatedArgs.templateType;
                const oDataEntitySetsString = validatedArgs.oDataEntitySets;
                const offline = validatedArgs.offline;
                const script = await generateTemplateBasedMetadata(oDataEntitySetsString, templateType, projectPath, offline, false);
                if (!script) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: Unable to read service metadata from .service.metadata file in project root ${projectPath}. Please make sure the file exists and is a valid JSON file.`,
                            },
                        ],
                    };
                }
                const resultText = runCommand(script);
                fs.unlinkSync(`${projectPath}/headless.json`);
                return {
                    content: [
                        {
                            type: "text",
                            text: resultText,
                        },
                    ],
                };
            }
            catch (error) {
                console.error(`MDK project generation failed:`, error);
                return {
                    content: [
                        {
                            type: "text",
                            text: error instanceof Error ? error.toString() : String(error),
                        },
                    ],
                };
            }
        }
        case "mdk-gen-entity": {
            try {
                // Validate all arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-gen-entity", request.params.arguments || {});
                const projectPath = validatedArgs.folderRootPath;
                const templateType = validatedArgs.templateType;
                const oDataEntitySetsString = validatedArgs.oDataEntitySets;
                const script = await generateTemplateBasedMetadata(oDataEntitySetsString, templateType, projectPath, false, true);
                if (!script) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: Unable to read service metadata. Please make sure either .service.metadata file exists in project root ${projectPath}, or .project.json file exists and corresponding .XML file in Services folder.`,
                            },
                        ],
                    };
                }
                const resultText = runCommand(script);
                fs.unlinkSync(`${projectPath}/headless.json`);
                return {
                    content: [
                        {
                            type: "text",
                            text: resultText,
                        },
                    ],
                };
            }
            catch (error) {
                console.error(`MDK entity generation failed:`, error);
                return {
                    content: [
                        {
                            type: "text",
                            text: error instanceof Error ? error.toString() : String(error),
                        },
                    ],
                };
            }
        }
        case "mdk-gen-i18n": {
            try {
                // Validate all arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-gen-i18n", request.params.arguments || {});
                const projectPath = validatedArgs.folderRootPath;
                const i18nFilePath = `${projectPath}/i18n/i18n.properties`;
                try {
                    // Read existing i18n content
                    const existingContent = fs.readFileSync(i18nFilePath, "utf-8");
                    // Prepare enhanced user prompt
                    const enhancedUserPrompt = `In my project, the default i18n file is ${existingContent}`;
                    // System prompt with clear instructions
                    const systemPrompt = `
          Imagine you are a helpful assistant from SAP company who can generate i18n files and translate the values in i18n files to a special language.
          
          Restrictions:
          - An i18n file is a file that contains the translated texts
          - The i18n file stores translations as key-value pairs
          - A resource bundle key-value pair consists of a key and a value separated by an equal sign
          - For each language, there's one resource bundle
          
          Instructions:
          - The key is consistent across resource bundles—it always stays the same—the value changes to each language
          - The keys are in CamelCase. The value is the actual text that should be displayed
          
          Requirements:
          - All i18n files end in .properties
          - Their names begin with an i18n, followed by an underscore, and the language's acronym, like i18n_en.properties
          - All strings for translation have to be annotated to provide more context for translation
          - An annotation consists of an 'X/Y text type classification, an optional length restriction, and a freetext explanation how the string is used on the UI
          - The annotation need not to be translated
          - Please show your whole output in Markdown fenced code block starting with ###i18n_{language code}.properties
          
          Restrictions:
          - Don't generate comments in the i18n file
          - Don't remove _ from keys
          - Don't generate X/Y text type classification, Customer list on dashboard= in the i18n file
        `.trim();
                    const prompt = systemPrompt + enhancedUserPrompt;
                    return {
                        content: [
                            {
                                type: "text",
                                text: prompt,
                            },
                        ],
                    };
                }
                catch (error) {
                    const errorMsg = error instanceof Error ? error.message : String(error);
                    console.error(`Error generating i18n files: ${errorMsg}`);
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: ${errorMsg}`,
                            },
                        ],
                    };
                }
            }
            catch (error) {
                console.error(`MDK i18n generation failed:`, error);
                return {
                    content: [
                        {
                            type: "text",
                            text: error instanceof Error ? error.toString() : String(error),
                        },
                    ],
                };
            }
        }
        case "mdk-gen-databinding-page": {
            try {
                // Validate all arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-gen-databinding-page", request.params.arguments || {});
                const projectPath = validatedArgs.folderRootPath;
                const controlType = validatedArgs.controlType;
                // Configuration constants
                const CONFIG = {
                    PROJECT_PATH: projectPath,
                    MDK_APP: projectPath.split("/").pop(),
                };
                const oJson = { section: controlType };
                // Prepare prompts
                const systemPrompt = `
        Imagine you are a helpful assistant from SAP company who can generate a page file for Mobile Development Kit.
        
        Instruction:
        - The page file name extension is ".page", please show all file name in ####{file_name}.
        - Please use the actual appName and Service file path in your output result.
        - Do not generate any comments in JSON file.
        - When the Section type is FormCell,if the data property type is Edm.String or String, generate Control.Type.FormCell.SimpleProperty, if the data property type is Edm.Boolean or Boolean, generate Control.Type.FormCell.Switch, if the data property type is Edm.DateTime or Date, generate Control.Type.FormCell.DatePicker.
        - When the Section type is FormCell,if the data property is key, don't generate formcell control.
        - When the Section type is FormCell, also generate the corresponding actions and javascript files.
        - Include file extension in file reference.
        - Don't include .json in generated file name.
        `;
                // Use getServiceDataWithFallback to get service data and path
                const serviceResult = getServiceDataWithFallback(projectPath);
                if (!serviceResult) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: Unable to read service metadata. Please make sure either .service.metadata file exists in project root ${projectPath}, or .project.json file exists and corresponding .XML file in Services folder.`,
                            },
                        ],
                    };
                }
                const SERVICE_DATA = serviceResult.serviceData;
                const MDK_SERVICE = serviceResult.servicePath;
                const MDK_EXAMPLE = fs.readFileSync(path.join(projectRoot, "res/templates/Page/DataBinding", oJson.section + ".md"), "utf-8");
                const enhancedUserPrompt = `In my project, the appName is ${CONFIG.MDK_APP}, the Service file path is ${MDK_SERVICE}, the Service data definition is 
          \`\`\`${SERVICE_DATA}\`\`\`
          the example is 
          \`\`\`${MDK_EXAMPLE}\`\`\``;
                const prompt = systemPrompt + enhancedUserPrompt;
                return {
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                    ],
                };
            }
            catch (error) {
                console.error("MDK page generation failed:", error);
                return {
                    content: [
                        {
                            type: "text",
                            text: `MDK page generation failed: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                };
            }
        }
        case "mdk-gen-layout-page": {
            try {
                // Validate all arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-gen-layout-page", request.params.arguments || {});
                const layoutType = validatedArgs.layoutType;
                const oJson = { layout: layoutType };
                // Prepare prompts
                const systemPrompt = `
        Imagine you are a helpful assistant from SAP company who can generate a page file for Mobile Development Kit.`;
                const MDK_EXAMPLE = fs.readFileSync(path.join(projectRoot, "res/templates/Page/Layout", oJson.layout + ".md"), "utf-8");
                const prompt = systemPrompt + MDK_EXAMPLE;
                return {
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                    ],
                };
            }
            catch (error) {
                console.error("MDK page generation failed:", error);
                return {
                    content: [
                        {
                            type: "text",
                            text: `MDK page generation failed: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                };
            }
        }
        case "mdk-gen-action": {
            try {
                // Validate all arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-gen-action", request.params.arguments || {});
                const projectPath = validatedArgs.folderRootPath;
                const actionType = validatedArgs.actionType;
                // Configuration constants
                const CONFIG = {
                    PROJECT_PATH: projectPath,
                    MDK_APP: projectPath.split("/").pop(),
                    DEFAULT_PROMPT: "Generate a mdk page displaying list of products.",
                };
                const oJson = { action: actionType };
                // Prepare prompts
                const systemPrompt = `
        Imagine you are a helpful assistant from SAP company who can generate an action file for Mobile Development Kit.
        
        Instruction:
        - Please use the actual appName and Service file path in your output result.
        - Do not generate any comments in JSON file.
        `;
                // Use getServiceDataWithFallback to get service data and path
                const serviceResult = getServiceDataWithFallback(projectPath);
                if (!serviceResult) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: Unable to read service metadata. Please make sure either .service.metadata file exists in project root ${projectPath}, or .project.json file exists and corresponding .XML file in Services folder.`,
                            },
                        ],
                    };
                }
                const SERVICE_DATA = serviceResult.serviceData;
                const MDK_SERVICE = serviceResult.servicePath;
                const MDK_EXAMPLE = fs.readFileSync(path.join(projectRoot, "res/templates/Action", oJson.action + ".md"), "utf-8");
                const enhancedUserPrompt = `In my project, the appName is ${CONFIG.MDK_APP}, the Service file path is ${MDK_SERVICE}, the Service data definition is 
          \`\`\`${SERVICE_DATA}\`\`\`
          the example is 
          \`\`\`${MDK_EXAMPLE}\`\`\``;
                const prompt = systemPrompt + enhancedUserPrompt;
                return {
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                    ],
                };
            }
            catch (error) {
                console.error("MDK action generation failed:", error);
                return {
                    content: [
                        {
                            type: "text",
                            text: `MDK action generation failed: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                };
            }
        }
        case "mdk-project-operation": {
            try {
                // Validate all arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-project-operation", request.params.arguments || {});
                const projectPath = validatedArgs.folderRootPath;
                const operation = validatedArgs.operation;
                const mdkToolsPath = await getModulePath("mdk-tools");
                switch (operation) {
                    case "build": {
                        // Construct build command using mdkToolsPath
                        let buildScript = "";
                        if (mdkToolsPath) {
                            const mdkBinary = path.join(mdkToolsPath, process.platform === "win32" ? "mdk.cmd" : "mdkcli.js");
                            const target = "zip";
                            buildScript = `${mdkBinary} build --target ${target} --project "${projectPath}"`;
                        }
                        // Execute build
                        const buildResult = runCommand(buildScript);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `MDK Build completed successfully.\n\n${buildResult}`,
                                },
                            ],
                        };
                    }
                    case "deploy": {
                        // Use getMobileServiceAppNameWithFallback to get mobile service app name with fallback logic
                        const mobileServiceAppName = getMobileServiceAppNameWithFallback(projectPath);
                        if (!mobileServiceAppName) {
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: `Error: Unable to read mobile service app name. Please make sure either .service.metadata file exists in project root ${projectPath}, or .project.json file exists.`,
                                    },
                                ],
                            };
                        }
                        // Configuration constants
                        const CONFIG = {
                            projectPath: projectPath,
                            deploymentTarget: "mobile",
                            projectName: mobileServiceAppName,
                            showQR: true,
                        };
                        // Construct deployment script using mdkToolsPath
                        let deploymentScript = "";
                        if (mdkToolsPath) {
                            const mdkBinary = path.join(mdkToolsPath, process.platform === "win32" ? "mdk.cmd" : "mdkcli.js");
                            deploymentScript = [
                                `${mdkBinary} deploy`,
                                `--target ${CONFIG.deploymentTarget}`,
                                `--name ${CONFIG.projectName}`,
                                CONFIG.showQR ? "--showqr" : "",
                                `--project "${CONFIG.projectPath}"`,
                            ]
                                .filter(Boolean)
                                .join(" ");
                        }
                        // Execute deployment command
                        const deployResult = runCommand(deploymentScript);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `MDK Deploy completed successfully.\n\n${deployResult}`,
                                },
                            ],
                        };
                    }
                    case "validate": {
                        // Construct validation command using mdkToolsPath
                        let validationScript = "";
                        if (mdkToolsPath) {
                            const mdkBinary = path.join(mdkToolsPath, process.platform === "win32" ? "mdk.cmd" : "mdkcli.js");
                            validationScript = `${mdkBinary} validate --project "${projectPath}"`;
                        }
                        // Execute validation
                        const validateResult = runCommand(validationScript);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `MDK Validation completed successfully.\n\n${validateResult}`,
                                },
                            ],
                        };
                    }
                    case "migrate": {
                        // Construct migration command using mdkToolsPath
                        let migrationScript = "";
                        if (mdkToolsPath) {
                            const mdkBinary = path.join(mdkToolsPath, process.platform === "win32" ? "mdk.cmd" : "mdkcli.js");
                            migrationScript = `${mdkBinary} migrate --project "${projectPath}"`;
                        }
                        // Execute migration
                        const migrateResult = runCommand(migrationScript);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `MDK Migration completed successfully.\n\n${migrateResult}`,
                                },
                            ],
                        };
                    }
                    case "show-qrcode": {
                        const qrCodePath = `${projectPath}/.build/qrcode.png`;
                        // Check if QR code exists
                        if (!fs.existsSync(qrCodePath)) {
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: `QR code not found at ${qrCodePath}. Please deploy the project first to generate a QR code.`,
                                    },
                                ],
                            };
                        }
                        const openCommand = `open ${qrCodePath}`;
                        runCommand(openCommand);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `QR code displayed successfully from ${qrCodePath}`,
                                },
                            ],
                        };
                    }
                    case "open-mobile-app-editor": {
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `Instructions to open Mobile App Editor:\n\n1. Execute "cf login --sso" in a terminal window.\n2. Press "Command+Shift+P" and then select "MDK: Open Mobile App Editor" command.\n3. Create/Select a new/existing mobile app.\n4. Select a destination.\n5. Click "Add App to Project" button.`,
                                },
                            ],
                        };
                    }
                    default: {
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `Unknown operation: ${operation}. Supported operations are: build, deploy, validate, migrate, show-qrcode, open-mobile-app-editor`,
                                },
                            ],
                        };
                    }
                }
            }
            catch (error) {
                // Handle errors gracefully
                console.error("MDK project manager operation failed:", error);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Operation failed: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                };
            }
        }
        case "mdk-search-documentation": {
            try {
                // Validate arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-search-documentation", request.params.arguments || {});
                const query = validatedArgs.query;
                const N = validatedArgs.N;
                const results = await search(query, N);
                const resultText = printResults(results);
                return {
                    content: [
                        {
                            type: "text",
                            text: resultText,
                        },
                    ],
                };
            }
            catch (error) {
                console.error(`MDK documentation search failed:`, error);
                return {
                    content: [
                        {
                            type: "text",
                            text: error instanceof Error ? error.toString() : String(error),
                        },
                    ],
                };
            }
        }
        case "mdk-get-component-documentation": {
            try {
                // Validate arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-get-component-documentation", request.params.arguments || {});
                const component_name = validatedArgs.component_name;
                const _results = await searchNames(component_name, 1);
                for (const file of filenameList) {
                    if (file.toLowerCase().includes(_results[0].content.toLowerCase()) &&
                        (file.endsWith(".json") || file.endsWith(".schema"))) {
                        const content = contentList[filenameList.indexOf(file)];
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: content,
                                },
                            ],
                        };
                    }
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: `Component ${component_name} not found.`,
                        },
                    ],
                };
            }
            catch (error) {
                console.error(`MDK component documentation retrieval failed:`, error);
                return {
                    content: [
                        {
                            type: "text",
                            text: error instanceof Error ? error.toString() : String(error),
                        },
                    ],
                };
            }
        }
        case "mdk-get-property-documentation": {
            try {
                // Validate arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-get-property-documentation", request.params.arguments || {});
                const component_name = validatedArgs.component_name;
                const property_name = validatedArgs.property_name;
                const searchResults = await searchNames(component_name, 1);
                for (const file of filenameList) {
                    if (file
                        .toLowerCase()
                        .includes(searchResults[0].content.toLowerCase()) &&
                        (file.endsWith(".json") || file.endsWith(".schema"))) {
                        const content = contentList[filenameList.indexOf(file)];
                        const parsedContent = JSON.parse(content);
                        if ("properties" in parsedContent &&
                            property_name in parsedContent.properties) {
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(parsedContent.properties[property_name], null, 2),
                                    },
                                ],
                            };
                        }
                        else {
                            break;
                        }
                    }
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: `No property called ${property_name} found in ${component_name}.`,
                        },
                    ],
                };
            }
            catch (error) {
                console.error(`MDK property documentation retrieval failed:`, error);
                return {
                    content: [
                        {
                            type: "text",
                            text: error instanceof Error ? error.toString() : String(error),
                        },
                    ],
                };
            }
        }
        case "mdk-get-example": {
            try {
                // Validate arguments using comprehensive validation
                const validatedArgs = validateToolArguments("mdk-get-example", request.params.arguments || {});
                const component_name = validatedArgs.component_name;
                const _results = await searchNames(component_name, 1);
                for (const file of filenameList) {
                    if (file.toLowerCase().includes(_results[0].content.toLowerCase()) &&
                        file.endsWith(".example.md")) {
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: contentList[filenameList.indexOf(file)],
                                },
                            ],
                        };
                    }
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: "No examples found for this component.",
                        },
                    ],
                };
            }
            catch (error) {
                console.error(`MDK example retrieval failed:`, error);
                return {
                    content: [
                        {
                            type: "text",
                            text: error instanceof Error ? error.toString() : String(error),
                        },
                    ],
                };
            }
        }
        default:
            throw new Error("Unknown tool");
    }
});
server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: [],
    };
});
/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
export default async function run(_options = {}) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MDK MCP server running...");
    if (!fs.existsSync(path.join(projectRoot, "build/embeddings/schema-chunks.bin"))) {
        retrieveAndStore(path.join(projectRoot, "res/schemas"));
    }
    [filenameList, contentList] = getDocuments();
}
