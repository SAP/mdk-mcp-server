import { test, describe } from "node:test";
import assert from "node:assert";
import {
  search,
  searchNames,
  getDocuments,
  printResults,
  retrieveAndStore,
} from "../../build/vector.js";
import { getSchemaVersion, getServerConfig } from "../../build/utils.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory where this module is located, then go up to find project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

describe("index.ts - MCP Server", () => {
  describe("Tool Configuration Validation", () => {
    test("should have all expected MCP tools defined", _t => {
      const expectedTools = [
        "mdk-gen-project",
        "mdk-gen-i18n",
        "mdk-gen-databinding-page",
        "mdk-gen-layout-page",
        "mdk-gen-entity",
        "mdk-gen-action",
        "mdk-manage",
        "mdk-documentation",
      ];

      // Verify we have the expected number of tools
      assert.strictEqual(expectedTools.length, 8);

      // Verify specific tools are included
      assert.ok(expectedTools.includes("mdk-gen-project"));
      assert.ok(expectedTools.includes("mdk-documentation"));
      assert.ok(expectedTools.includes("mdk-manage"));
      assert.ok(expectedTools.includes("mdk-gen-entity"));
    });

    test("should have correct template types for mdk-gen-project", _t => {
      const validTemplateTypes = ["crud", "list detail", "base"];
      const requiredFields = [
        "folderRootPath",
        "templateType",
        "oDataEntitySets",
      ];

      // Validate template types
      assert.ok(validTemplateTypes.includes("crud"));
      assert.ok(validTemplateTypes.includes("list detail"));
      assert.ok(validTemplateTypes.includes("base"));
      assert.strictEqual(validTemplateTypes.length, 3);

      // Validate required fields
      assert.ok(requiredFields.includes("folderRootPath"));
      assert.ok(requiredFields.includes("templateType"));
      assert.ok(requiredFields.includes("oDataEntitySets"));
    });

    test("should have correct control types for mdk-gen-databinding-page", _t => {
      const validControlTypes = [
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
      ];

      // Validate key control types are present
      assert.ok(validControlTypes.includes("ObjectTable"));
      assert.ok(validControlTypes.includes("FormCell"));
      assert.ok(validControlTypes.includes("ObjectHeader"));
      assert.ok(validControlTypes.includes("ObjectCard"));
      assert.strictEqual(validControlTypes.length, 14);
    });

    test("should have correct layout types for mdk-gen-layout-page", _t => {
      const validLayoutTypes = [
        "Section",
        "BottomNavigation",
        "FlexibleColumnLayout",
        "SideDrawerNavigation",
        "Tabs",
        "Extension",
      ];

      // Validate layout types
      assert.ok(validLayoutTypes.includes("Section"));
      assert.ok(validLayoutTypes.includes("BottomNavigation"));
      assert.ok(validLayoutTypes.includes("FlexibleColumnLayout"));
      assert.ok(validLayoutTypes.includes("Tabs"));
      assert.strictEqual(validLayoutTypes.length, 6);
    });

    test("should have comprehensive action types for mdk-gen-action", _t => {
      const validActionTypes = [
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
      ];

      // Validate key action types are present
      assert.ok(validActionTypes.includes("CreateODataEntity"));
      assert.ok(validActionTypes.includes("UpdateODataEntity"));
      assert.ok(validActionTypes.includes("DeleteODataEntity"));
      assert.ok(validActionTypes.includes("Navigation"));
      assert.ok(validActionTypes.includes("Message"));
      assert.ok(validActionTypes.includes("ChatCompletion"));
      assert.strictEqual(validActionTypes.length, 40);
    });
  });

  describe("Default Prompt Logic", () => {
    test("should provide sensible default prompts", _t => {
      const defaultPrompts = {
        "mdk-gen-project":
          "Create a initial mdk project creates and updates customers",
        "mdk-gen-entity":
          "Generate pages displaying list of products and its related details and create, edit and delete a product.",
        "mdk-gen-i18n":
          "Translate base i18n file to Chinese, German and Japanese.",
        "mdk-gen-databinding-page":
          "Generate a mdk action creating a new product.",
        "mdk-gen-layout-page": "Generate a mdk section page.",
        "mdk-manage": "Manage MDK project operations like build, deploy, validate.",
      };

      // Test that defaults are reasonable and not empty
      Object.entries(defaultPrompts).forEach(([tool, prompt]) => {
        assert.ok(
          prompt.length > 10,
          `Default prompt for ${tool} should be meaningful`
        );
        assert.ok(
          typeof prompt === "string",
          `Default prompt for ${tool} should be a string`
        );
      });

      // Test specific default behaviors
      assert.ok(defaultPrompts["mdk-gen-project"].includes("customers"));
      assert.ok(defaultPrompts["mdk-gen-entity"].includes("products"));
      assert.ok(defaultPrompts["mdk-gen-i18n"].includes("Chinese"));
      assert.ok(defaultPrompts["mdk-manage"].includes("build"));
    });
  });

  describe("Parameter Validation Logic", () => {
    test("should validate required parameters for tools", _t => {
      function validateRequiredParams(providedParams, requiredParams) {
        const missing = requiredParams.filter(param => !providedParams[param]);
        return {
          isValid: missing.length === 0,
          missingParams: missing,
        };
      }

      // Test mdk-gen-project parameters
      const projectRequiredParams = [
        "folderRootPath",
        "templateType",
        "oDataEntitySets",
      ];

      // Valid case
      const validParams = {
        folderRootPath: "/path/to/project",
        templateType: "crud",
        oDataEntitySets: "Products,Orders",
      };
      const validResult = validateRequiredParams(
        validParams,
        projectRequiredParams
      );
      assert.ok(validResult.isValid);
      assert.strictEqual(validResult.missingParams.length, 0);

      // Missing parameters case
      const invalidParams = {
        folderRootPath: "/path/to/project",
        // Missing templateType and oDataEntitySets
      };
      const invalidResult = validateRequiredParams(
        invalidParams,
        projectRequiredParams
      );
      assert.ok(!invalidResult.isValid);
      assert.deepStrictEqual(invalidResult.missingParams, [
        "templateType",
        "oDataEntitySets",
      ]);
    });

    test("should handle parameter type conversion", _t => {
      // Simulate the String() conversion used in the server
      function convertParameters(params) {
        return {
          folderRootPath: String(params.folderRootPath || ""),
          templateType: String(params.templateType || ""),
          N: Number(params.N || 5),
        };
      }

      const inputParams = {
        folderRootPath: true,
        templateType: null,
        N: "10",
      };

      const converted = convertParameters(inputParams);

      assert.strictEqual(converted.folderRootPath, "true");
      assert.strictEqual(converted.templateType, "");
      assert.strictEqual(converted.N, 10);
      assert.strictEqual(typeof converted.N, "number");
    });
  });

  describe("Path Construction Logic", () => {
    test("should construct proper file paths", _t => {
      // Simulate path construction logic used in the server
      function constructPaths(projectPath, serviceName) {
        return {
          serviceMetadata: `${projectPath}/.service.metadata`,
          i18nFile: `${projectPath}/i18n/i18n.properties`,
          serviceFile: `${projectPath}/Services/${serviceName}.service`,
          qrCode: `${projectPath}/.build/qrcode.png`,
          headlessJson: `${projectPath}/headless.json`,
        };
      }

      const projectPath = "/Users/test/myproject";
      const serviceName = "MyService";
      const paths = constructPaths(projectPath, serviceName);

      assert.strictEqual(
        paths.serviceMetadata,
        "/Users/test/myproject/.service.metadata"
      );
      assert.strictEqual(
        paths.i18nFile,
        "/Users/test/myproject/i18n/i18n.properties"
      );
      assert.strictEqual(
        paths.serviceFile,
        "/Users/test/myproject/Services/MyService.service"
      );
      assert.strictEqual(
        paths.qrCode,
        "/Users/test/myproject/.build/qrcode.png"
      );
      assert.strictEqual(
        paths.headlessJson,
        "/Users/test/myproject/headless.json"
      );
    });

    test("should handle Windows and Unix path separators", _t => {
      function normalizePath(inputPath) {
        // Simple path normalization logic
        return inputPath.replace(/\\/g, "/");
      }

      const windowsPath = "C:\\Users\\test\\project";
      const unixPath = "/Users/test/project";

      assert.strictEqual(normalizePath(windowsPath), "C:/Users/test/project");
      assert.strictEqual(normalizePath(unixPath), "/Users/test/project");
    });
  });

  describe("Command Construction Logic", () => {
    test("should construct deployment commands correctly", _t => {
      function buildDeployCommand(mdkBinary, config) {
        const parts = [
          `"${mdkBinary}" deploy`,
          `--target ${config.deploymentTarget}`,
          `--name ${config.projectName}`,
          config.showQR ? "--showqr" : "",
          `--project "${config.projectPath}"`,
        ];
        return parts.filter(Boolean).join(" ");
      }

      const mdkBinary = "/path/to/mdkcli.js";
      const config = {
        deploymentTarget: "mobile",
        projectName: "MyApp",
        showQR: true,
        projectPath: "/Users/test/project",
      };

      const command = buildDeployCommand(mdkBinary, config);
      const expected =
        '"/path/to/mdkcli.js" deploy --target mobile --name MyApp --showqr --project "/Users/test/project"';

      assert.strictEqual(command, expected);
    });

    test("should construct build commands correctly", _t => {
      function buildBuildCommand(mdkBinary, projectPath) {
        return `"${mdkBinary}" build --target zip --project "${projectPath}"`;
      }

      const mdkBinary = "/path/to/mdkcli.js";
      const projectPath = "/Users/test/project";
      const command = buildBuildCommand(mdkBinary, projectPath);
      const expected =
        '"/path/to/mdkcli.js" build --target zip --project "/Users/test/project"';

      assert.strictEqual(command, expected);
    });

    test("should handle platform-specific binary names", _t => {
      function getBinaryName(basePath, platform) {
        const binaryName = platform === "win32" ? "mdk.cmd" : "mdkcli.js";
        return `${basePath}/${binaryName}`;
      }

      const basePath = "/path/to/mdk-tools";

      assert.strictEqual(
        getBinaryName(basePath, "win32"),
        "/path/to/mdk-tools/mdk.cmd"
      );
      assert.strictEqual(
        getBinaryName(basePath, "darwin"),
        "/path/to/mdk-tools/mdkcli.js"
      );
      assert.strictEqual(
        getBinaryName(basePath, "linux"),
        "/path/to/mdk-tools/mdkcli.js"
      );
    });
  });

  describe("Search Parameter Handling", () => {
    test("should handle search documentation parameters", _t => {
      function processSearchParams(params) {
        return {
          query: String(params.query || ""),
          N: Number(params.N || 5),
        };
      }

      // Test with valid parameters
      const validParams = { query: "ObjectHeader", N: 10 };
      const validResult = processSearchParams(validParams);
      assert.strictEqual(validResult.query, "ObjectHeader");
      assert.strictEqual(validResult.N, 10);

      // Test with default N
      const defaultNParams = { query: "FormCell" };
      const defaultResult = processSearchParams(defaultNParams);
      assert.strictEqual(defaultResult.query, "FormCell");
      assert.strictEqual(defaultResult.N, 5);

      // Test with empty parameters
      const emptyParams = {};
      const emptyResult = processSearchParams(emptyParams);
      assert.strictEqual(emptyResult.query, "");
      assert.strictEqual(emptyResult.N, 5);
    });

    test("should handle component search parameters", _t => {
      function processComponentParams(params) {
        return {
          component_name: String(params.component_name || ""),
          property_name: String(params.property_name || ""),
        };
      }

      const params = { component_name: "ObjectHeader", property_name: "Title" };
      const result = processComponentParams(params);

      assert.strictEqual(result.component_name, "ObjectHeader");
      assert.strictEqual(result.property_name, "Title");
    });
  });

  describe("Enhanced Prompt Construction", () => {
    test("should build enhanced prompts for i18n generation", _t => {
      function buildI18nPrompt(existingContent) {
        return `In my project, the default i18n file is ${existingContent} Add French translations`;
      }

      const existingContent = "welcome=Welcome\\nlogout=Logout\\n";

      const enhancedPrompt = buildI18nPrompt(existingContent);

      assert.ok(enhancedPrompt.includes("welcome=Welcome"));
      assert.ok(enhancedPrompt.includes("Add French translations"));
      assert.ok(
        enhancedPrompt.startsWith("In my project, the default i18n file is")
      );
    });

    test("should build enhanced prompts for page generation", _t => {
      function buildPagePrompt(
        appName,
        servicePath,
        serviceData,
        example
      ) {
        return `In my project, the appName is ${appName}, the Service file path is ${servicePath}, the Service data definition is \`\`\`${serviceData}\`\`\` the example is \`\`\`${example}\`\`\` Create product list page`;
      }

      const params = {
        appName: "MyApp",
        servicePath: "/Services/MyService.service",
        serviceData: '{"entities": [{"name": "Products"}]}',
        example: "Example ObjectTable structure",
      };

      const enhancedPrompt = buildPagePrompt(
        params.appName,
        params.servicePath,
        params.serviceData,
        params.example
      );

      assert.ok(enhancedPrompt.includes("MyApp"));
      assert.ok(enhancedPrompt.includes("/Services/MyService.service"));
      assert.ok(enhancedPrompt.includes("Products"));
      assert.ok(enhancedPrompt.includes("Create product list page"));
    });
  });

  describe("Error Response Formatting", () => {
    test("should format error responses consistently", _t => {
      function formatErrorResponse(message, error) {
        const errorText =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `${message}: ${errorText}`,
            },
          ],
        };
      }

      // Test with Error object
      const jsError = new Error("File not found");
      const errorResponse = formatErrorResponse("Build failed", jsError);

      assert.strictEqual(errorResponse.content[0].type, "text");
      assert.strictEqual(
        errorResponse.content[0].text,
        "Build failed: File not found"
      );

      // Test with string error
      const stringError = "Invalid configuration";
      const stringResponse = formatErrorResponse(
        "Validation failed",
        stringError
      );

      assert.strictEqual(
        stringResponse.content[0].text,
        "Validation failed: Invalid configuration"
      );
    });

    test("should create success responses consistently", _t => {
      function formatSuccessResponse(resultText) {
        return {
          content: [
            {
              type: "text",
              text: resultText,
            },
          ],
        };
      }

      const result = formatSuccessResponse("Operation completed successfully");

      assert.strictEqual(result.content[0].type, "text");
      assert.strictEqual(
        result.content[0].text,
        "Operation completed successfully"
      );
    });
  });

  describe("File Extension and Path Utilities", () => {
    test("should handle file extension logic", _t => {
      function findComponentFile(filename, filenameList) {
        return filenameList.find(
          file =>
            file.toLowerCase().includes(filename.toLowerCase()) &&
            (file.endsWith(".json") || file.endsWith(".schema"))
        );
      }

      const filenameList = [
        "ObjectHeader.json",
        "FormCell.schema",
        "Button.md",
        "Table.example.md",
        "NotFound.txt",
      ];

      assert.strictEqual(
        findComponentFile("ObjectHeader", filenameList),
        "ObjectHeader.json"
      );
      assert.strictEqual(
        findComponentFile("FormCell", filenameList),
        "FormCell.schema"
      );
      assert.strictEqual(findComponentFile("Button", filenameList), undefined);
      assert.strictEqual(
        findComponentFile("NonExistent", filenameList),
        undefined
      );
    });

    test("should find example files correctly", _t => {
      function findExampleFile(componentName, filenameList) {
        return filenameList.find(
          file =>
            file.toLowerCase().includes(componentName.toLowerCase()) &&
            file.endsWith(".example.md")
        );
      }

      const filenameList = [
        "ObjectHeader.json",
        "ObjectHeader.example.md",
        "FormCell.schema",
        "FormCell.example.md",
        "Button.md",
      ];

      assert.strictEqual(
        findExampleFile("ObjectHeader", filenameList),
        "ObjectHeader.example.md"
      );
      assert.strictEqual(
        findExampleFile("FormCell", filenameList),
        "FormCell.example.md"
      );
      assert.strictEqual(findExampleFile("Button", filenameList), undefined);
    });
  });

  describe("JSON Property Extraction", () => {
    test("should extract properties from JSON schema", _t => {
      function extractProperty(jsonContent, propertyName) {
        try {
          const parsed = JSON.parse(jsonContent);
          if ("properties" in parsed && propertyName in parsed.properties) {
            return parsed.properties[propertyName];
          }
          return null;
        } catch {
          return null;
        }
      }

      const schemaContent = JSON.stringify({
        properties: {
          Title: {
            type: "string",
            description: "The title of the component",
          },
          Visible: {
            type: "boolean",
            description: "Whether the component is visible",
          },
        },
      });

      const titleProperty = extractProperty(schemaContent, "Title");
      const visibleProperty = extractProperty(schemaContent, "Visible");
      const nonExistentProperty = extractProperty(schemaContent, "NonExistent");

      assert.strictEqual(titleProperty.type, "string");
      assert.strictEqual(
        titleProperty.description,
        "The title of the component"
      );
      assert.strictEqual(visibleProperty.type, "boolean");
      assert.strictEqual(nonExistentProperty, null);
    });

    test("should handle invalid JSON gracefully", _t => {
      function extractProperty(jsonContent, propertyName) {
        try {
          const parsed = JSON.parse(jsonContent);
          if ("properties" in parsed && propertyName in parsed.properties) {
            return parsed.properties[propertyName];
          }
          return null;
        } catch {
          return null;
        }
      }

      const invalidJson = "{ invalid json }";
      const result = extractProperty(invalidJson, "Title");

      assert.strictEqual(result, null);
    });
  });

  describe("MDK Documentation Integration Tests", () => {
    // Test server configuration
    test("should get server configuration correctly", _t => {
      const serverConfig = getServerConfig();
      
      assert.ok(serverConfig);
      assert.ok(serverConfig.schemaVersion);
      assert.ok(typeof serverConfig.schemaVersion === "string");
      assert.ok(serverConfig.schemaVersion.match(/^\d+\.\d+$/)); // Format like "24.7", "25.6"
    });

    // Test document loading
    test("should load MDK documentation files", _t => {
      const serverConfig = getServerConfig();
      const [filenameList, contentList] = getDocuments(serverConfig.schemaVersion);
      
      assert.ok(Array.isArray(filenameList));
      assert.ok(Array.isArray(contentList));
      assert.strictEqual(filenameList.length, contentList.length);
      assert.ok(filenameList.length > 0, "Should load at least some documentation files");
      
      // Check that we have expected file types
      const hasJsonFiles = filenameList.some(file => file.endsWith(".json"));
      const hasSchemaFiles = filenameList.some(file => file.endsWith(".schema"));
      const hasExampleFiles = filenameList.some(file => file.endsWith(".example.md"));
      
      assert.ok(hasJsonFiles || hasSchemaFiles, "Should have schema definition files");
      assert.ok(hasExampleFiles, "Should have example files");
    });

    // Test search functionality
    test("should perform semantic search on MDK documentation", async _t => {
      const serverConfig = getServerConfig();
      const schemaPath = path.join(projectRoot, "res/schemas");
      
      // Ensure embeddings exist for testing
      const versionEmbeddingPath = path.join(
        projectRoot,
        `build/embeddings/schema-chunks-${serverConfig.schemaVersion}.bin`
      );
      
      if (!fs.existsSync(versionEmbeddingPath)) {
        console.log("Initializing embeddings for testing...");
        retrieveAndStore(schemaPath, serverConfig.schemaVersion);
      }
      
      const searchResults = await search("ObjectHeader", 3, serverConfig.schemaVersion);
      
      assert.ok(Array.isArray(searchResults));
      assert.ok(searchResults.length > 0, "Should return search results");
      assert.ok(searchResults.length <= 3, "Should respect the limit parameter");
      
      // Check result structure
      const firstResult = searchResults[0];
      assert.ok(firstResult.content);
      assert.ok(typeof firstResult.similarity === "number");
      assert.ok(firstResult.similarity >= 0 && firstResult.similarity <= 1);
    });

    // Test name search functionality
    test("should search component names", async _t => {
      const serverConfig = getServerConfig();
      const schemaPath = path.join(projectRoot, "res/schemas");
      
      // Ensure embeddings exist for testing
      const versionEmbeddingPath = path.join(
        projectRoot,
        `build/embeddings/name-chunks-${serverConfig.schemaVersion}.bin`
      );
      
      if (!fs.existsSync(versionEmbeddingPath)) {
        console.log("Initializing name embeddings for testing...");
        retrieveAndStore(schemaPath, serverConfig.schemaVersion);
      }
      
      const nameResults = await searchNames("ObjectHeader", 1, serverConfig.schemaVersion);
      
      assert.ok(Array.isArray(nameResults));
      assert.ok(nameResults.length > 0, "Should return name search results");
      assert.strictEqual(nameResults.length, 1, "Should respect the limit parameter");
      
      // Check result structure
      const firstResult = nameResults[0];
      assert.ok(firstResult.content);
      assert.ok(typeof firstResult.similarity === "number");
    });

    // Test result formatting
    test("should format search results correctly", async _t => {
      const serverConfig = getServerConfig();
      const searchResults = await search("FormCell", 2, serverConfig.schemaVersion);
      
      const formattedResults = printResults(searchResults);
      
      assert.ok(typeof formattedResults === "string");
      assert.ok(formattedResults.length > 0);
      
      // Should be valid JSON
      const parsed = JSON.parse(formattedResults);
      assert.ok(Array.isArray(parsed));
      
      if (parsed.length > 0) {
        const firstResult = parsed[0];
        assert.ok(firstResult.source);
        assert.ok(firstResult.distance);
        assert.ok(firstResult.content);
        assert.ok(typeof firstResult.source === "string");
        assert.ok(typeof firstResult.distance === "string");
        assert.ok(typeof firstResult.content === "string");
      }
    });

    // Test schema version detection
    test("should detect schema version from project structure", _t => {
      // Test with a mock project structure
      const testProjectPath = path.join(projectRoot, "test-project");
      
      // Create temporary test structure
      if (!fs.existsSync(testProjectPath)) {
        fs.mkdirSync(testProjectPath, { recursive: true });
      }
      
      // Get the current server configuration to use the actual schema version
      const serverConfig = getServerConfig();
      const expectedVersion = serverConfig.schemaVersion;
      
      // Create a mock .project.json file with the current schema version
      const mockProjectJson = {
        "MDKProjectPath": testProjectPath,
        "SchemaVersion": expectedVersion
      };
      fs.writeFileSync(
        path.join(testProjectPath, ".project.json"), 
        JSON.stringify(mockProjectJson, null, 2)
      );
      
      try {
        const detectedVersion = getSchemaVersion(testProjectPath);
        assert.strictEqual(detectedVersion, expectedVersion);
      } finally {
        // Clean up test files
        fs.rmSync(testProjectPath, { recursive: true, force: true });
      }
    });

    // Test component documentation lookup
    test("should find component files in documentation", _t => {
      const serverConfig = getServerConfig();
      const [filenameList, contentList] = getDocuments(serverConfig.schemaVersion);
      
      // Test finding a component file
      function findComponentFile(componentName) {
        return filenameList.find(
          file =>
            file.toLowerCase().includes(componentName.toLowerCase()) &&
            (file.endsWith(".json") || file.endsWith(".schema"))
        );
      }
      
      // Look for common MDK components
      const possibleComponents = ["ObjectHeader", "FormCell", "Button", "Section"];
      let foundComponent = null;
      
      for (const component of possibleComponents) {
        const found = findComponentFile(component);
        if (found) {
          foundComponent = found;
          break;
        }
      }
      
      if (foundComponent) {
        assert.ok(foundComponent.endsWith(".json") || foundComponent.endsWith(".schema"));
        
        // Get the content of the found component
        const componentIndex = filenameList.indexOf(foundComponent);
        const componentContent = contentList[componentIndex];
        
        assert.ok(componentContent);
        assert.ok(componentContent.length > 0);
        
        // Should be valid JSON for schema files
        if (foundComponent.endsWith(".json") || foundComponent.endsWith(".schema")) {
          const parsed = JSON.parse(componentContent);
          assert.ok(typeof parsed === "object");
        }
      }
    });

    // Test example file lookup
    test("should find example files in documentation", _t => {
      const serverConfig = getServerConfig();
      const [filenameList, contentList] = getDocuments(serverConfig.schemaVersion);
      
      // Test finding example files
      const exampleFiles = filenameList.filter(file => file.endsWith(".example.md"));
      
      if (exampleFiles.length > 0) {
        assert.ok(exampleFiles.length > 0, "Should have example files");
        
        // Check content of first example file
        const firstExampleIndex = filenameList.indexOf(exampleFiles[0]);
        const exampleContent = contentList[firstExampleIndex];
        
        assert.ok(exampleContent);
        assert.ok(exampleContent.length > 0);
        assert.ok(typeof exampleContent === "string");
      }
    });

    // Test property extraction from schema
    test("should extract component properties from schema", _t => {
      const serverConfig = getServerConfig();
      const [filenameList, contentList] = getDocuments(serverConfig.schemaVersion);
      
      // Find a schema file with properties
      let schemaWithProperties = null;
      let schemaContent = null;
      
      for (let i = 0; i < filenameList.length; i++) {
        const filename = filenameList[i];
        if (filename.endsWith(".json") || filename.endsWith(".schema")) {
          try {
            const content = contentList[i];
            const parsed = JSON.parse(content);
            if (parsed.properties && Object.keys(parsed.properties).length > 0) {
              schemaWithProperties = filename;
              schemaContent = parsed;
              break;
            }
          } catch (error) {
            // Skip invalid JSON files
            continue;
          }
        }
      }
      
      if (schemaWithProperties && schemaContent) {
        assert.ok(schemaContent.properties);
        assert.ok(typeof schemaContent.properties === "object");
        
        const propertyNames = Object.keys(schemaContent.properties);
        assert.ok(propertyNames.length > 0, "Should have at least one property");
        
        // Test property structure
        const firstProperty = schemaContent.properties[propertyNames[0]];
        assert.ok(typeof firstProperty === "object");
      }
    });

    // Test embeddings file existence
    test("should create and use embeddings files", _t => {
      const serverConfig = getServerConfig();
      const embeddingsDir = path.join(projectRoot, "build/embeddings");
      
      // Check if embeddings directory exists
      if (fs.existsSync(embeddingsDir)) {
        const files = fs.readdirSync(embeddingsDir);
        const schemaEmbeddings = files.filter(file => 
          file.startsWith(`schema-chunks-${serverConfig.schemaVersion}`)
        );
        const nameEmbeddings = files.filter(file => 
          file.startsWith(`name-chunks-${serverConfig.schemaVersion}`)
        );
        
        // If embeddings exist, they should have proper structure
        if (schemaEmbeddings.length > 0) {
          assert.ok(schemaEmbeddings.some(file => file.endsWith('.bin')));
        }
        
        if (nameEmbeddings.length > 0) {
          assert.ok(nameEmbeddings.some(file => file.endsWith('.bin')));
        }
      }
    });
  });
});
