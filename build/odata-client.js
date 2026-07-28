import axios from "axios";
/**
 * OData client for querying OData services
 */
export class ODataClient {
    axiosInstance;
    baseUrl;
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
        const axiosConfig = {
            timeout: config.timeout || 30000,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...config.headers,
            },
        };
        if (config.username && config.password) {
            axiosConfig.auth = {
                username: config.username,
                password: config.password,
            };
        }
        this.axiosInstance = axios.create(axiosConfig);
    }
    /**
     * Build query string from OData options
     */
    buildQueryString(options) {
        const params = new URLSearchParams();
        if (options.$filter) {
            params.append("$filter", options.$filter);
        }
        if (options.$select) {
            params.append("$select", options.$select);
        }
        if (options.$expand) {
            params.append("$expand", options.$expand);
        }
        if (options.$orderby) {
            params.append("$orderby", options.$orderby);
        }
        if (options.$top !== undefined) {
            params.append("$top", options.$top.toString());
        }
        if (options.$skip !== undefined) {
            params.append("$skip", options.$skip.toString());
        }
        if (options.$count) {
            params.append("$count", "true");
        }
        if (options.$search) {
            params.append("$search", options.$search);
        }
        const queryString = params.toString();
        return queryString ? `?${queryString}` : "";
    }
    /**
     * Get service metadata ($metadata)
     */
    async getMetadata() {
        try {
            const response = await this.axiosInstance.get(`${this.baseUrl}/$metadata`, {
                headers: { Accept: "application/xml" },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch metadata: ${error.message}`);
        }
    }
    /**
     * Get service document (root)
     */
    async getServiceDocument() {
        try {
            const response = await this.axiosInstance.get(this.baseUrl);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch service document: ${error.message}`);
        }
    }
    /**
     * Query an entity set
     */
    async query(entitySet, options = {}) {
        try {
            const queryString = this.buildQueryString(options);
            const url = `${this.baseUrl}/${entitySet}${queryString}`;
            const response = await this.axiosInstance.get(url);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to query ${entitySet}: ${error.message}`);
        }
    }
    /**
     * Get a single entity by key
     */
    async getEntity(entitySet, key, options = {}) {
        try {
            const queryString = this.buildQueryString(options);
            const keyString = typeof key === "string" ? `'${key}'` : key;
            const url = `${this.baseUrl}/${entitySet}(${keyString})${queryString}`;
            const response = await this.axiosInstance.get(url);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get entity from ${entitySet}: ${error.message}`);
        }
    }
    /**
     * Create a new entity
     */
    async create(entitySet, data) {
        try {
            const url = `${this.baseUrl}/${entitySet}`;
            const response = await this.axiosInstance.post(url, data);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create entity in ${entitySet}: ${error.message}`);
        }
    }
    /**
     * Update an entity
     */
    async update(entitySet, key, data) {
        try {
            const keyString = typeof key === "string" ? `'${key}'` : key;
            const url = `${this.baseUrl}/${entitySet}(${keyString})`;
            const response = await this.axiosInstance.patch(url, data);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to update entity in ${entitySet}: ${error.message}`);
        }
    }
    /**
     * Delete an entity
     */
    async delete(entitySet, key) {
        try {
            const keyString = typeof key === "string" ? `'${key}'` : key;
            const url = `${this.baseUrl}/${entitySet}(${keyString})`;
            await this.axiosInstance.delete(url);
        }
        catch (error) {
            throw new Error(`Failed to delete entity from ${entitySet}: ${error.message}`);
        }
    }
    /**
     * Execute a function import
     */
    async callFunction(functionName, parameters = {}) {
        try {
            const params = Object.entries(parameters)
                .map(([key, value]) => {
                const encodedValue = typeof value === "string" ? `'${value}'` : value;
                return `${key}=${encodedValue}`;
            })
                .join(",");
            const url = `${this.baseUrl}/${functionName}(${params})`;
            const response = await this.axiosInstance.get(url);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to call function ${functionName}: ${error.message}`);
        }
    }
    /**
     * Execute an action import
     */
    async callAction(actionName, parameters = {}) {
        try {
            const url = `${this.baseUrl}/${actionName}`;
            const response = await this.axiosInstance.post(url, parameters);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to call action ${actionName}: ${error.message}`);
        }
    }
    /**
     * Count entities in an entity set
     */
    async count(entitySet, filter) {
        try {
            const filterParam = filter ? `?$filter=${filter}` : "";
            const url = `${this.baseUrl}/${entitySet}/$count${filterParam}`;
            const response = await this.axiosInstance.get(url, {
                headers: { Accept: "text/plain" },
            });
            return parseInt(response.data, 10);
        }
        catch (error) {
            throw new Error(`Failed to count entities in ${entitySet}: ${error.message}`);
        }
    }
}
/**
 * Create an OData client instance
 */
export function createODataClient(config) {
    return new ODataClient(config);
}
