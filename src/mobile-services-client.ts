import axios, { AxiosInstance } from "axios";

/**
 * Mobile Services application structure
 */
export interface MobileServicesApp {
  name: string;
  displayName: string;
  services: Array<{
    name: string;
    parameters?: {
      endpointConfigurations?: MobileServicesDestination[];
    };
  }>;
  security?: {
    name: string;
    oauth_settings?: Array<{
      client_id: string;
      redirect_url: string;
    }>;
  };
  apis?: Array<{
    type: string;
    url: string;
  }>;
}

/**
 * Mobile Services destination configuration
 */
export interface MobileServicesDestination {
  endPointName: string;
  endPointAddress?: string;
  cloudDestinationName?: string;
  ssoMethod?: string;
  useCloudConnector?: boolean;
}

/**
 * Client for interacting with SAP Mobile Services Admin API
 */
export class MobileServicesClient {
  private axios: AxiosInstance;

  constructor(private adminAPI: string, private cfToken: string) {
    this.axios = axios.create({
      baseURL: adminAPI,
      headers: {
        Authorization: cfToken,
        "X-Requested-With": "application/json",
      },
    });
  }

  /**
   * List all Mobile Services applications in current space
   * Filters to only include apps with proxy service (OData destinations)
   */
  async listApplications(): Promise<MobileServicesApp[]> {
    try {
      const response = await this.axios.get("/apps");
      const apps: MobileServicesApp[] = response.data;

      // Filter to only apps with proxy service
      return apps.filter(
        app =>
          Array.isArray(app.services) &&
          app.services.some(s => s.name === "proxy")
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to list Mobile Services applications: ${error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Get details of a specific Mobile Services application
   */
  async getApplication(appId: string): Promise<MobileServicesApp> {
    try {
      const response = await this.axios.get(`/app/${appId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Mobile Services application '${appId}' not found`);
        }
        throw new Error(`Failed to get application details: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get list of destinations configured in a Mobile Services application
   */
  async getDestinations(appId: string): Promise<MobileServicesDestination[]> {
    const app = await this.getApplication(appId);

    const proxyService = app.services?.find(s => s.name === "proxy");
    if (!proxyService?.parameters?.endpointConfigurations) {
      return [];
    }

    return proxyService.parameters.endpointConfigurations;
  }

  /**
   * Fetch OData metadata from a Mobile Services destination
   * Uses the Mobile Services conduit/proxy pattern
   */
  async fetchMetadata(
    appId: string,
    destination: string,
    pathSuffix: string = ""
  ): Promise<string> {
    try {
      // Build metadata URL
      let metadataUrl = destination;
      if (pathSuffix) {
        metadataUrl += pathSuffix;
      }
      metadataUrl += "/$metadata";

      // Create conduit request
      const conduit = {
        appId,
        encapsulateResponse: true,
        method: "GET",
        url: metadataUrl,
      };

      // Encode conduit request in base64
      const conduitBody = Buffer.from(JSON.stringify(conduit)).toString(
        "base64"
      );

      // Make request through conduit
      const url = `/app/${appId}/service/proxy/Admin/proxy/v1/conduitWithHeaderContent`;
      const response = await this.axios.get(url, {
        headers: {
          "X-SMP-CONDUIT-REQ-BODY": conduitBody,
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/xml",
        },
      });

      // Decode response
      const body = response.data;
      if (body.status?.code === 200 && body.bodyBase64) {
        return Buffer.from(body.bodyBase64, "base64").toString("utf-8");
      }

      throw new Error(
        `Failed to fetch metadata: Status ${body.status?.code || "unknown"}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(
            `Destination '${destination}' not found in Mobile Services app '${appId}'. ` +
              `Please check the destination name and ensure it's configured in Mobile Services.`
          );
        }
        throw new Error(`Failed to fetch metadata: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Check if a destination exists in a Mobile Services application
   */
  async destinationExists(
    appId: string,
    destination: string
  ): Promise<boolean> {
    try {
      const destinations = await this.getDestinations(appId);
      return destinations.some(d => d.endPointName === destination);
    } catch {
      return false;
    }
  }
}

/**
 * Create a Mobile Services client instance
 * @param adminAPI Mobile Services Admin API URL
 * @param cfToken CF access token (should include "bearer " prefix)
 */
export function createMobileServicesClient(
  adminAPI: string,
  cfToken: string
): MobileServicesClient {
  return new MobileServicesClient(adminAPI, cfToken);
}
