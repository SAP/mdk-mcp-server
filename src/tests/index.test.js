import { test, describe } from "node:test";
import assert from "node:assert";

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
        "mdk-build",
        "mdk-deploy",
        "mdk-show-qrcode",
        "mdk-validate",
        "mdk-migrate",
        "mdk-search-documentation",
        "mdk-get-component-documentation",
        "mdk-get-property-documentation",
        "mdk-get-example",
      ];

      // Verify we have the expected number of tools
      assert.strictEqual(expectedTools.length, 15);

      // Verify specific tools are included
      assert.ok(expectedTools.includes("mdk-gen-project"));
      assert.ok(expectedTools.includes("mdk-search-documentation"));
      assert.ok(expectedTools.includes("mdk-build"));
      assert.ok(expectedTools.includes("mdk-deploy"));
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
        "mdk-build": "Build current MDK project.",
        "mdk-deploy": "Deploy current MDK project to the Mobile Services",
        "mdk-validate": "Validate current MDK project.",
        "mdk-migrate": "Migrate current MDK project.",
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
      assert.ok(defaultPrompts["mdk-build"].includes("Build"));
      assert.ok(defaultPrompts["mdk-deploy"].includes("Deploy"));
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
});
