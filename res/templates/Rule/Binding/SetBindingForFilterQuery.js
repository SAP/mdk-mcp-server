export default function SetBindingForFilterQuery(clientAPI) {
    // Pass a custom object as the navigation binding to the next page.
    const data = {
        State1: 'CA',
        State2: {
        City2: 'Atlanta',
        City3: {
            Street: '438B Alexandra Technopark.',
        },
        },
    };
    const pageProxy = clientAPI.getPageProxy();
    pageProxy.setActionBinding(data);
    return pageProxy.executeAction('/MDKDevApp/Actions/Filter/FilterTest4.action');
    }