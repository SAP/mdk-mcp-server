import * as fs from "fs";
import * as os from "os";
import * as path from "path";

/**
 * Cloud Foundry configuration structure from ~/.cf/config.json
 */
export interface CFConfig {
  AccessToken: string;
  RefreshToken: string;
  Target: string;
  OrganizationFields: {
    GUID: string;
    Name: string;
  };
  SpaceFields: {
    GUID: string;
    Name: string;
  };
}

/**
 * Get CF token from ~/.cf/config.json
 * @returns CF access token (includes "bearer " prefix) or null if not found
 */
export function getCFToken(): string | null {
  try {
    const config = getCFConfig();
    return config?.AccessToken || null;
  } catch {
    return null;
  }
}

/**
 * Get complete CF configuration
 * @returns CF config object or null if not found/invalid
 */
export function getCFConfig(): CFConfig | null {
  try {
    const cfConfigPath = path.join(os.homedir(), ".cf", "config.json");

    if (!fs.existsSync(cfConfigPath)) {
      return null;
    }

    const configContent = fs.readFileSync(cfConfigPath, "utf-8");
    const config: CFConfig = JSON.parse(configContent);

    // Validate required fields
    if (
      !config.AccessToken ||
      !config.Target ||
      !config.OrganizationFields?.GUID ||
      !config.SpaceFields?.GUID
    ) {
      return null;
    }

    return config;
  } catch {
    return null;
  }
}

/**
 * Check if user is logged into CF CLI
 * @returns true if valid CF session exists
 */
export function isCFLoggedIn(): boolean {
  return getCFToken() !== null;
}

/**
 * Get Mobile Services Admin API URL from CF configuration
 * @param landscapeType Mobile Services landscape type
 * @returns Admin API URL or null if CF not logged in
 */
export function getMobileServicesAdminAPI(
  landscapeType: "Standard" | "Preview" = "Standard"
): string | null {
  const config = getCFConfig();
  if (!config) {
    return null;
  }

  // Extract base domain from CF target
  // Examples:
  // - https://api.cf.sap.hana.ondemand.com -> sap.hana.ondemand.com
  // - https://api.cf.eu10.hana.ondemand.com -> eu10.hana.ondemand.com
  let host = config.Target;

  // Remove protocol
  if (host.startsWith("https://")) {
    host = host.substring(8);
  } else if (host.startsWith("http://")) {
    host = host.substring(7);
  }

  // Remove 'api.cf.' prefix
  if (host.startsWith("api.cf.")) {
    host = host.substring(7);
  }

  // Remove port if present
  const portIndex = host.indexOf(":");
  if (portIndex > -1) {
    host = host.substring(0, portIndex);
  }

  // Remove trailing slash if present
  host = host.replace(/\/$/, "");

  // Build admin API URL
  const subdomain =
    landscapeType === "Preview"
      ? "mobile-service-cockpit-api-preview"
      : "mobile-service-cockpit-api";

  const orgGuid = encodeURIComponent(config.OrganizationFields.GUID);
  const spaceGuid = encodeURIComponent(config.SpaceFields.GUID);

  return `https://${subdomain}.cfapps.${host}/cockpit/v1/org/${orgGuid}/space/${spaceGuid}`;
}

/**
 * Get formatted error message for CF authentication issues
 * @returns User-friendly error message with setup instructions
 */
export function getCFAuthErrorMessage(): string {
  return `Cloud Foundry CLI authentication required.

Please follow these steps:
1. Install CF CLI: https://docs.cloudfoundry.org/cf-cli/install-go-cli.html
2. Login: cf login --sso
3. Target your org/space: cf target -o <org> -s <space>

Then try the operation again.`;
}
