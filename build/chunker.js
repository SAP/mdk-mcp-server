/**
 * This class provides chunking logic used for splitting the MDK JSON schema files into chunks that can be used for vector embedding for similarity search.
 * Vector embedding and search is done in vector.ts.
 */
export class Chunker {
    constructor() {
        // No initialization needed
    }
    /**
     * Helper function to recursively chunk the JSON schema into smaller chunks for vector embedding.
     * It assumes that each .json file in the schemas folder is a valid JSON. (important for chunking logic!)
     * Each chunk corresponds to a property of an MDK component.
     * The parents list is used to keep track of the hierarchy of the properties.
     * To see a clear example of chunk contents, run this script to get the chunks of the ObjectHeader.
     */
    chunkifyJSON(documentName, documentDetails, parents = []) {
        const chunks = [];
        let parentString = "";
        if (parents.length > 0) {
            parentString = "FROM " + parents.slice().reverse().join(" FROM ");
        }
        if (documentDetails.description) {
            let descChunk = `PROPERTY OF ${documentName} ${parentString}\n`;
            descChunk += `${documentName}: ${documentDetails.description}`;
            chunks.push(descChunk);
        }
        if (documentDetails.properties) {
            const propertyList = documentDetails.properties;
            parents.push(documentName);
            for (const property in propertyList) {
                const propertyDetails = propertyList[property]; // get the details of each property, if there is a properties list
                const recursedChunks = this.chunkifyJSON(property, propertyDetails, parents);
                chunks.push(...recursedChunks);
            }
            delete documentDetails.properties;
        }
        return chunks;
    }
    /**
     * Given a .json MDK schema file contents, this would parse the JSON, and return a list of chunks
     */
    splitText(jsonDocument) {
        const documentDetails = JSON.parse(jsonDocument);
        const documentName = documentDetails.title || "";
        const chunks = this.chunkifyJSON(documentName, documentDetails, []);
        return chunks;
    }
}
