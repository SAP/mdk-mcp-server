export default function SetDebugSettings(clientAPI) {
    let debugODataProvider = true;
    let tracingEnabled = true;
    let tracingCategories = [ 'mdk.trace.odata', 'mdk.trace.profiling' ];
    clientAPI.setDebugSettings(debugODataProvider, tracingEnabled, tracingCategories);    
}
