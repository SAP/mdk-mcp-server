import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { execSync } from "child_process";
/**
 * Security: Resolve cf binary to a trusted absolute path
 * Only accepts cf binaries from system directories to prevent PATH injection
 */
function resolveCFBinary() {
    // Trusted system directories where cf should be installed
    const trustedPaths = [
        "/usr/local/bin/cf",
        "/usr/bin/cf",
        "/opt/homebrew/bin/cf", // macOS Homebrew on Apple Silicon
        "/home/linuxbrew/.linuxbrew/bin/cf", // Linux Homebrew
    ];
    // On Windows, also check common installation paths
    if (process.platform === "win32") {
        trustedPaths.push("C:\\Program Files\\Cloud Foundry\\cf.exe", "C:\\Program Files (x86)\\Cloud Foundry\\cf.exe");
    }
    // Check trusted paths first
    for (const trustedPath of trustedPaths) {
        if (fs.existsSync(trustedPath)) {
            return trustedPath;
        }
    }
    // If not in trusted paths, try to resolve via PATH and validate
    try {
        const resolvedPath = execSync("which cf 2>/dev/null || command -v cf", {
            encoding: "utf8",
            stdio: "pipe",
        }).trim();
        if (resolvedPath && fs.existsSync(resolvedPath)) {
            // Validate that the resolved path is in a system directory
            const absolutePath = fs.realpathSync(resolvedPath);
            // Only accept paths in system directories, not in user writable locations
            const isInSystemDir = absolutePath.startsWith("/usr/") ||
                absolutePath.startsWith("/opt/") ||
                absolutePath.startsWith("/home/linuxbrew/") ||
                (process.platform === "win32" &&
                    absolutePath.match(/^[A-Z]:\\Program Files/i));
            if (isInSystemDir) {
                return absolutePath;
            }
            console.warn(`[Security] cf binary at ${absolutePath} is not in a trusted system directory`);
        }
    }
    catch {
        // PATH resolution failed
    }
    // Fallback to bare name (will rely on PATH) with a warning
    console.warn("[Security Warning] Could not resolve cf binary to a trusted path. Using PATH resolution.");
    return "cf";
}
// Cache the resolved cf binary path to avoid repeated resolution
let cachedCFBinary = null;
function getCFBinary() {
    if (!cachedCFBinary) {
        cachedCFBinary = resolveCFBinary();
    }
    return cachedCFBinary;
}
/**
 * Get CF token from ~/.cf/config.json
 * @returns CF access token (includes "bearer " prefix) or null if not found
 */
export function getCFToken() {
    try {
        const config = getCFConfig();
        return config?.AccessToken || null;
    }
    catch {
        return null;
    }
}
/**
 * Get complete CF configuration
 * @returns CF config object or null if not found/invalid
 */
export function getCFConfig() {
    try {
        const cfConfigPath = path.join(os.homedir(), ".cf", "config.json");
        if (!fs.existsSync(cfConfigPath)) {
            return null;
        }
        const configContent = fs.readFileSync(cfConfigPath, "utf-8");
        const config = JSON.parse(configContent);
        // Validate required fields
        if (!config.AccessToken ||
            !config.Target ||
            !config.OrganizationFields?.GUID ||
            !config.SpaceFields?.GUID) {
            return null;
        }
        return config;
    }
    catch {
        return null;
    }
}
/**
 * Check if user is logged into CF CLI with a valid token
 * @returns true if valid CF session exists
 */
export function isCFLoggedIn() {
    try {
        // Security: Use resolved cf binary path instead of bare "cf"
        const cfBinary = getCFBinary();
        // Try to execute a simple CF command to verify the token is valid
        // Using 'cf target' is fast and will fail if token is expired
        execSync(`"${cfBinary}" target`, {
            stdio: "pipe",
            encoding: "utf-8",
        });
        return true;
    }
    catch {
        // Token is missing, expired, or CF CLI is not working
        return false;
    }
}
/**
 * Get Mobile Services Admin API URL from CF configuration
 * @param landscapeType Mobile Services landscape type
 * @returns Admin API URL or null if CF not logged in
 */
export function getMobileServicesAdminAPI(landscapeType = "Standard") {
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
    }
    else if (host.startsWith("http://")) {
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
    const subdomain = landscapeType === "Preview"
        ? "mobile-service-cockpit-api-preview"
        : "mobile-service-cockpit-api";
    const orgGuid = encodeURIComponent(config.OrganizationFields.GUID);
    const spaceGuid = encodeURIComponent(config.SpaceFields.GUID);
    return `https://${subdomain}.cfapps.${host}/cockpit/v1/org/${orgGuid}/space/${spaceGuid}`;
}
/**
 * Refresh CF token by calling `cf oauth-token`
 * This updates the token in ~/.cf/config.json
 * @returns true if token refresh was successful, false otherwise
 */
export function refreshCFToken() {
    try {
        console.error("[MDK MCP Server] Refreshing CF OAuth token...");
        // Security: Use resolved cf binary path instead of bare "cf"
        const cfBinary = getCFBinary();
        // Execute cf oauth-token command
        // This command refreshes the token and updates ~/.cf/config.json
        execSync(`"${cfBinary}" oauth-token`, {
            stdio: "pipe", // Suppress output
            encoding: "utf-8",
        });
        console.error("[MDK MCP Server] CF OAuth token refreshed successfully");
        return true;
    }
    catch (error) {
        console.error(`[MDK MCP Server] Failed to refresh CF token: ${error instanceof Error ? error.message : String(error)}`);
        return false;
    }
}
/**
 * Get formatted error message for CF authentication issues with VS Code command
 * @returns User-friendly error message with Command Palette instructions and terminal option
 */
export function getCFAuthErrorMessage() {
    return `# Cloud Foundry Authentication Required

You have **two options** to authenticate:

## Option 1: Use VS Code Command Palette (Recommended)
1. Press **\`Cmd+Shift+P\`** (Mac) or **\`Ctrl+Shift+P\`** (Windows/Linux)
2. Type: **\`CF: Login to Cloud Foundry\`**
3. Press **Enter**
4. Follow the prompts in the Cloud Foundry Tools extension

## Option 2: Use Terminal
Run this command in your terminal:
\`\`\`bash
cf login --sso
\`\`\`

Then:
1. Visit the passcode URL shown
2. Copy the passcode from your browser
3. Paste it into the terminal
4. Select your organization and space

After completing authentication with either option, retry the deployment.`;
}
