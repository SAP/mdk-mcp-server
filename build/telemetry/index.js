import { ClientFactory, PerformanceMeasurementAPI as Performance, SampleRate, initTelemetrySettings, } from "@sap-ux/telemetry";
import { isInternalFeaturesSettingEnabled } from "@sap-ux/feature-toggle";
import { isAppStudio } from "@sap-ux/btp-utils";
import osName from "os-name";
import i18next from "i18next";
import { createRequire } from "module";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load environment variables from .env file in the package root
config({ path: join(__dirname, "../../.env"), quiet: true });
const require = createRequire(import.meta.url);
const packageJson = require("../../package.json");
const version = packageJson.version;
export const mcpServerName = "@sap/mdk-mcp-server";
export const unknownTool = "unknown-tool";
const resourceId = process.env.INSTRUMENTATION_KEY ||
    "ApplicationInsightsInstrumentationKeyPLACEH0LDER";
/**
 * Helper class for intialising and preparing event data for telemetry.
 */
export class TelemetryHelper {
    static _telemetryData;
    static _previousEventTimestamp;
    /**
     * Returns the telemetry data.
     *
     * @returns telemetry data
     */
    static get telemetryData() {
        return this._telemetryData;
    }
    /**
     * Load telemetry settings.
     *
     * @param options - tools suite telemetry init settings
     */
    static async initTelemetrySettings(options) {
        const telemetryOptions = {
            consumerModule: {
                name: mcpServerName,
                version,
            },
            watchTelemetrySettingStore: false,
            internalFeature: isInternalFeaturesSettingEnabled(),
            resourceId,
            ...options,
        };
        try {
            await initTelemetrySettings(telemetryOptions);
        }
        catch (error) {
            console.error(`Error initializing telemetry settings:`, error);
        }
    }
    /**
     * Creates telemetry data and adds default telemetry props.
     *
     * @param additionalData - set additional properties to be reported by telemetry
     * @param filterDups - filters duplicates by returning undefined if it's suspected to be a repeated event based on previous telemetry data & timestamp (1 second)
     * @returns telemetry data
     */
    static createTelemetryData(additionalData, filterDups = false) {
        const currentTimestamp = new Date().getTime();
        if (!this._previousEventTimestamp) {
            filterDups = false; // can't filter duplicates if no previous event timestamp
            this._previousEventTimestamp = currentTimestamp;
        }
        if (!this._telemetryData) {
            let osVersionName = i18next.t("telemetry.unknownOs");
            try {
                osVersionName = osName();
            }
            catch {
                // no matched os name, possible beta or unreleased version
            }
            this._telemetryData = {
                Platform: isAppStudio() ? "SBAS" : "VSCode",
                OperatingSystem: osVersionName,
            };
        }
        if (filterDups) {
            const newTelemData = { ...this._telemetryData, ...additionalData };
            if (Math.abs(this._previousEventTimestamp - currentTimestamp) < 1000 &&
                JSON.stringify(newTelemData) === JSON.stringify(this._telemetryData)) {
                return undefined;
            }
        }
        this._previousEventTimestamp = currentTimestamp;
        this._telemetryData = Object.assign(this._telemetryData, additionalData);
        return this._telemetryData;
    }
    /**
     * Prepares the telemetry event by calculating the generation time if a mark name is provided.
     *
     * @param telemetryEventName - The name of the telemetry event
     * @param telemetryData - The telemetry data
     * @returns The prepared telemetry event
     */
    static prepareTelemetryEvent(telemetryEventName, telemetryData) {
        // Make sure performance measurement end is called
        this.markToolsEndTime();
        const requestTime = telemetryData.markName
            ? Performance.getMeasurementDuration(telemetryData.markName)
            : undefined;
        return {
            eventName: telemetryEventName,
            properties: telemetryData,
            measurements: requestTime ? { RequestTime: requestTime } : {},
        };
    }
    /**
     * Marks the start time. Example usage:
     * At the start of the MCP tool calling phase.
     * It should not be updated everytime calling createTelemetryData().
     */
    static markToolStartTime() {
        this.createTelemetryData({
            markName: Performance.startMark("MCP_LOADING_TIME"),
        });
    }
    /**
     * Marks the end time. Example usage:
     * At the end of the writing phase of the MCP tool calling phase.
     */
    static markToolsEndTime() {
        if (this._telemetryData?.markName) {
            Performance.endMark(this._telemetryData.markName);
            Performance.measure(this._telemetryData.markName);
        }
    }
    /**
     * Sends the telemetry event to the telemetry client.
     *
     * @param telemetryEventName - the event name to be reported
     * @param telemetryData - the telemetry data
     * @param appPath - the path of the application
     * @returns - a promise that resolves when the event is sent
     */
    static async sendTelemetry(telemetryEventName, telemetryData, appPath) {
        const telemetryEvent = this.prepareTelemetryEvent(telemetryEventName, telemetryData);
        await ClientFactory.getTelemetryClient().reportEvent(telemetryEvent, SampleRate.NoSampling, appPath ? { appPath } : undefined);
    }
    /**
     * Gets the telemetry name of the module.
     *
     * @returns The module telemetry name.
     */
    static getTelemetryName() {
        return mcpServerName;
    }
}
