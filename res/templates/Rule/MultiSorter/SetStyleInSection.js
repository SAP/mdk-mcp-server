/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetStyleInSection(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('SectionedTable0').getControl('OrderByMulit');
    multiSorterProxy.setStyle("ObjectCardBackground", "MultiSorter")
    .setStyle("ChartContentTitle", "Caption")
    .setStyle("ObjectHeaderChartTrendTitle", "Items/DisplayValue")
    .setStyle("ObjectHeaderChartTitle", "Items/DirectionLabel")
    multiSorterProxy.redraw();
}