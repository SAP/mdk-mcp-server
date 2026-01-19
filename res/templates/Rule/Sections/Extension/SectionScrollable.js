export default function SectionScrollable(clientAPI) {
    let pageClientData = clientAPI.getPageProxy().getClientData();
    if (pageClientData) {
        if (pageClientData.scrollable === undefined) {
            pageClientData.scrollable = false;
        }
        return pageClientData.scrollable;
    }
    return 0;
}