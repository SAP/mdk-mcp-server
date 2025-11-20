export default function SetIsScrollable(clientAPI) {
    let pageClientData = clientAPI.getPageProxy().getClientData();
    if (pageClientData) {
        if (pageClientData.scrollable === undefined) {
            pageClientData.scrollable = true;
        } else {
            pageClientData.scrollable = !pageClientData.scrollable;
        }
        clientAPI.getPageProxy().redraw();
    }
    return 0;
}