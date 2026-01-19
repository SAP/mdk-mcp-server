export default function SectionHeight(clientAPI) {
    let pageClientData = clientAPI.getPageProxy().getClientData();
    if (pageClientData) {
        if (pageClientData.height === undefined) {
            pageClientData.height = 0;
        }
        pageClientData.height += 100;
        return pageClientData.height;
    }
    return 0;
}