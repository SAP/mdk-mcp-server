import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  runCommand,
  getModulePath,
  generateTemplateBasedMetadata,
  getServiceDataWithFallback,
  getMobileServiceAppNameWithFallback,
} from "./utils.js";
import { validateToolArguments } from "./validation.js";
import path from "path";
import fs from "fs";
import {
  retrieveAndStore,
  search,
  searchNames,
  getDocuments,
  printResults,
} from "./vector.js";
import { fileURLToPath } from "url";

// Get the directory where this module is located, then go up to find project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

let filenameList: string[] = [];
let contentList: string[] = [];

const server = new Server(
  {
    name: "mdk-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

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
              description:
                "The OData entity sets are relevant to the user prompt, separated by commas.",
            },
            offline: {
              type: "boolean",
              description:
                "Whether to generate the project in offline mode, set to false unless offline is explicitly specified.",
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
        description:
          "Returns a prompt to be used for generating i18n files for MDK application. Using the prompt, you need to create files in path i18n/i18n.properties. You can describe texts, labels, messages.",
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
        description:
          "Returns a prompt to be used for generating a databinding-enabled MDK page. Using the prompt, you need to create a .page file that describes the page layout, controls and data bindings",
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
              description:
                "The type of the control to be used in the MDK page.",
            },
          },
          required: ["folderRootPath", "controlType"],
        },
      },
      {
        name: "mdk-gen-layout-page",
        description:
          "Generates a layout-based MDK page. You can describe the page layout. It saves the response to .page file.",
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
        description:
          "Generates CRUD or List Detail template metadata for a new entity set.",
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
              description:
                "The OData entity sets are relevant to the user prompt, separated by commas.",
            },
          },
          required: ["folderRootPath", "templateType", "oDataEntitySets"],
        },
      },
      {
        name: "mdk-gen-action",
        description:
          "Returns a prompt to be used for generating an MDK action. Using the prompt, you need to create a .action file that describes the action type and data bindings.",
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
        name: "mdk-build",
        description: "Build a MDK project.",
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
        name: "mdk-deploy",
        description: "Deploy a MDK project to the Mobile Services.",
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
        name: "mdk-show-qrcode",
        description:
          "Show QR code for a MDK application. The QR code MUST be scanned with the SAP Mobile Services Client app. The QR code cannot be used with the SAP Mobile Start app.",
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
        name: "mdk-migrate",
        description: "Migrate a MDK project to the latest MDK version.",
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
        name: "mdk-validate",
        description: "Validate a MDK project.",
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
        name: "mdk-search-documentation",
        description:
          "Returns the top N results from MDK documentation by semantic search, sorted by relevance.",
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
        description:
          "Returns the schema of an MDK component based on the name of the component.",
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
        description:
          "Returns the documentation of a specific property of an MDK component.",
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
      {
        name: "mdk-open-mobile-app-editor",
        description:
          "Instruct how to open the Mobile App Editor to create .service.metadata file.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    ],
  };
});

/**
 * Handler for the tools.
 */
server.setRequestHandler(CallToolRequestSchema, async request => {
  switch (request.params.name) {
    case "mdk-gen-project": {
      try {
        // Validate all arguments using comprehensive validation
        const validatedArgs = validateToolArguments(
          "mdk-gen-project",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;
        const templateType = validatedArgs.templateType as string;
        const oDataEntitySetsString = validatedArgs.oDataEntitySets as string;
        const offline = validatedArgs.offline as boolean;

        const script = await generateTemplateBasedMetadata(
          oDataEntitySetsString,
          templateType,
          projectPath,
          offline,
          false
        );

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
      } catch (error) {
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
        const validatedArgs = validateToolArguments(
          "mdk-gen-entity",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;
        const templateType = validatedArgs.templateType as string;
        const oDataEntitySetsString = validatedArgs.oDataEntitySets as string;

        const script = await generateTemplateBasedMetadata(
          oDataEntitySetsString,
          templateType,
          projectPath,
          false,
          true
        );

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
      } catch (error) {
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
        const validatedArgs = validateToolArguments(
          "mdk-gen-i18n",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;
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
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
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
      } catch (error) {
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
        const validatedArgs = validateToolArguments(
          "mdk-gen-databinding-page",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;
        const controlType = validatedArgs.controlType as string;

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
        const MDK_EXAMPLE = fs.readFileSync(
          path.join(
            projectRoot,
            "res/templates/Page/DataBinding",
            oJson.section + ".md"
          ),
          "utf-8"
        );

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
      } catch (error) {
        console.error("MDK page generation failed:", error);

        return {
          content: [
            {
              type: "text",
              text: `MDK page generation failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }

    case "mdk-gen-layout-page": {
      try {
        // Validate all arguments using comprehensive validation
        const validatedArgs = validateToolArguments(
          "mdk-gen-layout-page",
          request.params.arguments || {}
        );

        const layoutType = validatedArgs.layoutType as string;
        const oJson = { layout: layoutType };

        // Prepare prompts
        const systemPrompt = `
        Imagine you are a helpful assistant from SAP company who can generate a page file for Mobile Development Kit.`;

        const MDK_EXAMPLE = fs.readFileSync(
          path.join(
            projectRoot,
            "res/templates/Page/Layout",
            oJson.layout + ".md"
          ),
          "utf-8"
        );

        const prompt = systemPrompt + MDK_EXAMPLE;

        return {
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        };
      } catch (error) {
        console.error("MDK page generation failed:", error);

        return {
          content: [
            {
              type: "text",
              text: `MDK page generation failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }

    case "mdk-gen-action": {
      try {
        // Validate all arguments using comprehensive validation
        const validatedArgs = validateToolArguments(
          "mdk-gen-action",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;
        const actionType = validatedArgs.actionType as string;

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
        const MDK_EXAMPLE = fs.readFileSync(
          path.join(projectRoot, "res/templates/Action", oJson.action + ".md"),
          "utf-8"
        );

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
      } catch (error) {
        console.error("MDK action generation failed:", error);

        return {
          content: [
            {
              type: "text",
              text: `MDK action generation failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }

    case "mdk-build": {
      try {
        // Validate all arguments using comprehensive validation
        const validatedArgs = validateToolArguments(
          "mdk-build",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;
        const mdkToolsPath = await getModulePath("mdk-tools");

        // Construct build command using mdkToolsPath
        let buildScript: string = "";
        if (mdkToolsPath) {
          const mdkBinary = path.join(
            mdkToolsPath,
            process.platform === "win32" ? "mdk.cmd" : "mdkcli.js"
          );
          buildScript = `${mdkBinary} build --target zip --project "${projectPath}"`;
        }

        // Execute build
        const resultText = runCommand(buildScript);

        // Return success response
        return {
          content: [
            {
              type: "text",
              text: resultText,
            },
          ],
        };
      } catch (error) {
        // Handle errors gracefully
        console.error("MDK build failed:", error);

        return {
          content: [
            {
              type: "text",
              text: `Build failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }

    case "mdk-deploy": {
      try {
        // Validate all arguments using comprehensive validation
        const validatedArgs = validateToolArguments(
          "mdk-deploy",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;

        // Use getMobileServiceAppNameWithFallback to get mobile service app name with fallback logic
        const mobileServiceAppName =
          getMobileServiceAppNameWithFallback(projectPath);
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

        // Get MDK tools path
        const mdkToolsPath = await getModulePath("mdk-tools");

        // Construct deployment script using mdkToolsPath
        let deploymentScript: string = "";
        if (mdkToolsPath) {
          const mdkBinary = path.join(
            mdkToolsPath,
            process.platform === "win32" ? "mdk.cmd" : "mdkcli.js"
          );
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
        const resultText = runCommand(deploymentScript);

        // Return success response
        return {
          content: [
            {
              type: "text",
              text: resultText,
            },
          ],
        };
      } catch (error) {
        // Handle deployment errors
        console.error("MDK deployment failed:", error);
        return {
          content: [
            {
              type: "text",
              text: `Deployment failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }

    case "mdk-show-qrcode": {
      try {
        // Validate all arguments using comprehensive validation
        const validatedArgs = validateToolArguments(
          "mdk-show-qrcode",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;

        const openCommand = `open ${projectPath}/.build/qrcode.png`;
        runCommand(openCommand);

        return {
          content: [
            {
              type: "text",
              text: "QR code displayed successfully.",
            },
          ],
        };
      } catch (error) {
        console.error("QR code display failed:", error);
        return {
          content: [
            {
              type: "text",
              text: `QR code display failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }

    case "mdk-validate": {
      try {
        // Validate all arguments using comprehensive validation
        const validatedArgs = validateToolArguments(
          "mdk-validate",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;
        const mdkToolsPath = await getModulePath("mdk-tools");

        // Construct validation command using mdkToolsPath
        let validationScript: string = "";
        if (mdkToolsPath) {
          const mdkBinary = path.join(
            mdkToolsPath,
            process.platform === "win32" ? "mdk.cmd" : "mdkcli.js"
          );
          validationScript = `node --no-deprecation ${mdkBinary} validate --project "${projectPath}"`;
        }

        // Execute validation
        //const resultText = runCommand(validationScript);

        // Return success response
        return {
          content: [
            {
              type: "text",
              text: validationScript,
            },
          ],
        };
      } catch (error) {
        // Handle errors gracefully
        console.error("MDK validation failed:", error);

        return {
          content: [
            {
              type: "text",
              text: `Validation failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }

    case "mdk-migrate": {
      try {
        // Validate all arguments using comprehensive validation
        const validatedArgs = validateToolArguments(
          "mdk-migrate",
          request.params.arguments || {}
        );

        const projectPath = validatedArgs.folderRootPath as string;
        const mdkToolsPath = await getModulePath("mdk-tools");

        // Construct migration command using mdkToolsPath
        let migrationScript: string = "";
        if (mdkToolsPath) {
          const mdkBinary = path.join(
            mdkToolsPath,
            process.platform === "win32" ? "mdk.cmd" : "mdkcli.js"
          );
          migrationScript = `${mdkBinary} migrate --project "${projectPath}"`;
        }

        // Execute migration
        const resultText = runCommand(migrationScript);

        // Return success response
        return {
          content: [
            {
              type: "text",
              text: resultText,
            },
          ],
        };
      } catch (error) {
        // Handle errors gracefully
        console.error("MDK migration failed:", error);

        return {
          content: [
            {
              type: "text",
              text: `Migration failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }

    case "mdk-search-documentation": {
      try {
        // Validate arguments using comprehensive validation
        const validatedArgs = validateToolArguments(
          "mdk-search-documentation",
          request.params.arguments || {}
        );

        const query = validatedArgs.query as string;
        const N = validatedArgs.N as number;
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
      } catch (error) {
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
        const validatedArgs = validateToolArguments(
          "mdk-get-component-documentation",
          request.params.arguments || {}
        );

        const component_name = validatedArgs.component_name as string;
        const _results = await searchNames(component_name, 1);
        for (const file of filenameList) {
          if (
            file.toLowerCase().includes(_results[0].content.toLowerCase()) &&
            (file.endsWith(".json") || file.endsWith(".schema"))
          ) {
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
      } catch (error) {
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
        const validatedArgs = validateToolArguments(
          "mdk-get-property-documentation",
          request.params.arguments || {}
        );

        const component_name = validatedArgs.component_name as string;
        const property_name = validatedArgs.property_name as string;
        const searchResults = await searchNames(component_name, 1);
        for (const file of filenameList) {
          if (
            file
              .toLowerCase()
              .includes(searchResults[0].content.toLowerCase()) &&
            (file.endsWith(".json") || file.endsWith(".schema"))
          ) {
            const content = contentList[filenameList.indexOf(file)];
            const parsedContent = JSON.parse(content);
            if (
              "properties" in parsedContent &&
              property_name in parsedContent.properties
            ) {
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(
                      parsedContent.properties[property_name],
                      null,
                      2
                    ),
                  },
                ],
              };
            } else {
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
      } catch (error) {
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
        const validatedArgs = validateToolArguments(
          "mdk-get-example",
          request.params.arguments || {}
        );

        const component_name = validatedArgs.component_name as string;
        const _results = await searchNames(component_name, 1);
        for (const file of filenameList) {
          if (
            file.toLowerCase().includes(_results[0].content.toLowerCase()) &&
            file.endsWith(".example.md")
          ) {
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
      } catch (error) {
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

    case "mdk-open-mobile-app-editor": {
      return {
        content: [
          {
            type: "text",
            text: `1. Execute "cf login --sso" in a terminal window.\n2. Press "Command+Shift+P" and then select "MDK: Open Mobile App Editor" command.\n3. Create/Select a new/existing mobile app.\n4. Select a destination.\n5. Click "Add App to Project" button.`,
          },
        ],
      };
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

  if (
    !fs.existsSync(path.join(projectRoot, "build/embeddings/schema-chunks.bin"))
  ) {
    retrieveAndStore(path.join(projectRoot, "res/schemas"));
  }
  [filenameList, contentList] = getDocuments();
}
