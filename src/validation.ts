/**
 * Comprehensive input validation system for MDK MCP Server
 * This module provides robust validation for all user-provided data
 */

import path from "path";
import { z } from "zod";

// Input size limits
const MAX_STRING_LENGTH = 10000;
const MAX_PATH_LENGTH = 1000;
const MAX_ENTITY_SETS = 50;

// Allowed characters for different input types - support Windows paths with drive letters and backslashes
const SAFE_PATH_REGEX = /^[a-zA-Z0-9._\-/\\\s:()]+$/;
const SAFE_PROMPT_REGEX = /^[\w\s.,;:!?()[\]{}"'=+/@#$%&*`~\n\r\t_-]+$/;
const COMPONENT_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
const ENTITY_SET_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

// Define validation schemas using Zod
export const ValidationSchemas = {
  folderRootPath: z
    .string()
    .min(1, "Path cannot be empty")
    .max(MAX_PATH_LENGTH, `Path cannot exceed ${MAX_PATH_LENGTH} characters`)
    .regex(SAFE_PATH_REGEX, "Path contains invalid characters")
    .refine(
      path => !path.includes(".."),
      "Path cannot contain directory traversal sequences"
    )
    .refine(
      path => !path.includes("~"),
      "Path cannot contain home directory references"
    ),

  offline: z
    .boolean()
    .refine(val => val === undefined || val === true || val === false, {
      message: "Offline must be true or false if provided",
    })
    .default(false),

  templateType: z.enum(["crud", "list detail", "base"], {
    message: "Invalid template type",
  }),

  operation: z.enum(
    [
      "build",
      "deploy",
      "validate",
      "migrate",
      "show-qrcode",
      "open-mobile-app-editor",
    ],
    {
      message: "Invalid operation type",
    }
  ),

  controlType: z.enum(
    [
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
    {
      message: "Invalid control type",
    }
  ),

  layoutType: z.enum(
    [
      "Section",
      "BottomNavigation",
      "FlexibleColumnLayout",
      "SideDrawerNavigation",
      "Tabs",
      "Extension",
    ],
    {
      message: "Invalid layout type",
    }
  ),

  actionType: z.enum(
    [
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
    {
      message: "Invalid action type",
    }
  ),

  documentationOperation: z.enum(
    ["search", "component", "property", "example"],
    {
      message: "Invalid documentation operation type",
    }
  ),

  oDataEntitySets: z
    .string()
    .min(1, "Entity sets cannot be empty")
    .max(
      MAX_STRING_LENGTH,
      `Entity sets cannot exceed ${MAX_STRING_LENGTH} characters`
    )
    .refine(str => {
      const entitySets = str
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
      return entitySets.length <= MAX_ENTITY_SETS;
    }, `Cannot specify more than ${MAX_ENTITY_SETS} entity sets`)
    .refine(str => {
      const entitySets = str
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
      return entitySets.every(entity => ENTITY_SET_REGEX.test(entity));
    }, "Entity set names contain invalid characters"),

  componentName: z
    .string()
    .min(1, "Component name cannot be empty")
    .max(100, "Component name cannot exceed 100 characters")
    .regex(COMPONENT_NAME_REGEX, "Component name contains invalid characters"),

  propertyName: z
    .string()
    .min(1, "Property name cannot be empty")
    .max(100, "Property name cannot exceed 100 characters")
    .regex(COMPONENT_NAME_REGEX, "Property name contains invalid characters"),

  searchQuery: z
    .string()
    .min(1, "Search query cannot be empty")
    .max(500, "Search query cannot exceed 500 characters")
    .regex(SAFE_PROMPT_REGEX, "Search query contains invalid characters"),

  resultCount: z
    .number()
    .int("Result count must be an integer")
    .min(1, "Result count must be at least 1")
    .max(100, "Result count cannot exceed 100")
    .default(5),
};

/**
 * Validation error class with detailed error information
 */
export class ValidationError extends Error {
  public readonly field: string;
  public readonly value: unknown;
  public readonly issues: string[];

  constructor(field: string, value: unknown, issues: string[]) {
    super(`Validation failed for field '${field}': ${issues.join(", ")}`);
    this.name = "ValidationError";
    this.field = field;
    this.value = value;
    this.issues = issues;
  }
}

/**
 * Enhanced path validation with security checks
 */
export function validateSecurePath(inputPath: string): string {
  // First validate with schema
  const result = ValidationSchemas.folderRootPath.safeParse(inputPath);
  if (!result.success) {
    throw new ValidationError(
      "path",
      inputPath,
      result.error.issues.map(i => i.message)
    );
  }

  // Additional security checks
  const resolvedPath = path.resolve(inputPath);

  // Check for suspicious patterns (handle both Windows and Unix paths)
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /[/\\]proc[/\\]/, // Linux proc filesystem
    /[/\\]sys[/\\]/, // Linux sys filesystem
    /[/\\]dev[/\\]/, // Device files
    /[/\\]etc[/\\]/, // System configuration
    /C:[/\\]Windows/i, // Windows system directory
    /C:[/\\]System32/i, // Windows system32
    /[/\\]Library[/\\]/, // macOS system library
    /[/\\]System[/\\]/, // macOS system directory
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(resolvedPath)) {
      throw new ValidationError("path", inputPath, [
        "Path accesses restricted system directories",
      ]);
    }
  }

  return resolvedPath;
}

/**
 * Sanitize user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  return (
    input
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // Remove control characters
      .replace(/[<>]/g, "") // Remove angle brackets to prevent XML/HTML injection
      .trim()
  );
}

/**
 * Validate tool arguments for specific MDK tools
 */
export function validateToolArguments(
  toolName: string,
  args: Record<string, unknown>
): Record<string, unknown> {
  const validatedArgs: Record<string, unknown> = {};

  switch (toolName) {
    case "mdk-create": {
      validatedArgs.folderRootPath = validateSecurePath(
        String(args.folderRootPath)
      );
      
      // Validate scope
      const scopeSchema = z.enum(["project", "entity"], {
        message: "Invalid scope type",
      });
      validatedArgs.scope = scopeSchema.parse(args.scope);
      
      validatedArgs.templateType = ValidationSchemas.templateType.parse(
        args.templateType
      );
      validatedArgs.oDataEntitySets = ValidationSchemas.oDataEntitySets.parse(
        args.oDataEntitySets
      );
      validatedArgs.offline = ValidationSchemas.offline.parse(args.offline);
      break;
    }

    case "mdk-gen": {
      // Validate artifact type
      const artifactTypeSchema = z.enum(["page", "action", "i18n", "rule"], {
        message: "Invalid artifact type",
      });
      validatedArgs.artifactType = artifactTypeSchema.parse(args.artifactType);
      
      const artifactType = validatedArgs.artifactType as string;
      
      // Validate artifact-specific parameters
      if (artifactType === "page") {
        validatedArgs.folderRootPath = validateSecurePath(
          String(args.folderRootPath)
        );
        
        // Validate page type
        const pageTypeSchema = z.enum(["databinding", "layout"], {
          message: "Invalid page type",
        });
        
        if (!args.pageType) {
          throw new ValidationError("pageType", args.pageType, [
            "Page type is required for page artifact",
          ]);
        }
        
        validatedArgs.pageType = pageTypeSchema.parse(args.pageType);
        const pageType = validatedArgs.pageType as string;
        
        if (pageType === "databinding") {
          if (!args.controlType) {
            throw new ValidationError("controlType", args.controlType, [
              "Control type is required for databinding pages",
            ]);
          }
          validatedArgs.controlType = ValidationSchemas.controlType.parse(
            args.controlType
          );
        } else if (pageType === "layout") {
          if (!args.layoutType) {
            throw new ValidationError("layoutType", args.layoutType, [
              "Layout type is required for layout pages",
            ]);
          }
          validatedArgs.layoutType = ValidationSchemas.layoutType.parse(
            args.layoutType
          );
        }
      } else if (artifactType === "action") {
        validatedArgs.folderRootPath = validateSecurePath(
          String(args.folderRootPath)
        );
        
        if (!args.actionType) {
          throw new ValidationError("actionType", args.actionType, [
            "Action type is required for action artifact",
          ]);
        }
        
        validatedArgs.actionType = ValidationSchemas.actionType.parse(
          args.actionType
        );
      } else if (artifactType === "i18n") {
        validatedArgs.folderRootPath = validateSecurePath(
          String(args.folderRootPath)
        );
      } else if (artifactType === "rule") {
        if (!args.query) {
          throw new ValidationError("query", args.query, [
            "Query is required for rule artifact",
          ]);
        }
        validatedArgs.query = ValidationSchemas.searchQuery.parse(args.query);
      }
      break;
    }

    case "mdk-manage":
      validatedArgs.folderRootPath = validateSecurePath(
        String(args.folderRootPath)
      );
      validatedArgs.operation = ValidationSchemas.operation.parse(
        args.operation
      );
      break;

    case "mdk-docs": {
      validatedArgs.folderRootPath = validateSecurePath(
        String(args.folderRootPath)
      );
      validatedArgs.operation = ValidationSchemas.documentationOperation.parse(
        args.operation
      );

      // Validate operation-specific parameters
      const operation = validatedArgs.operation as string;
      if (operation === "search") {
        if (!args.query) {
          throw new ValidationError("query", args.query, [
            "Query is required for search operation",
          ]);
        }
        validatedArgs.query = ValidationSchemas.searchQuery.parse(args.query);
        validatedArgs.N = ValidationSchemas.resultCount.parse(args.N || 5);
      } else if (operation === "component" || operation === "example") {
        if (!args.component_name) {
          throw new ValidationError("component_name", args.component_name, [
            "Component name is required for this operation",
          ]);
        }
        validatedArgs.component_name = ValidationSchemas.componentName.parse(
          args.component_name
        );
      } else if (operation === "property") {
        if (!args.component_name) {
          throw new ValidationError("component_name", args.component_name, [
            "Component name is required for property operation",
          ]);
        }
        if (!args.property_name) {
          throw new ValidationError("property_name", args.property_name, [
            "Property name is required for property operation",
          ]);
        }
        validatedArgs.component_name = ValidationSchemas.componentName.parse(
          args.component_name
        );
        validatedArgs.property_name = ValidationSchemas.propertyName.parse(
          args.property_name
        );
      }
      break;
    }

    default:
      throw new ValidationError("toolName", toolName, ["Unknown tool name"]);
  }

  return validatedArgs;
}

/**
 * Generic input validation function
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  value: unknown,
  fieldName: string
): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new ValidationError(
      fieldName,
      value,
      result.error.issues.map(i => i.message)
    );
  }
  return result.data;
}
