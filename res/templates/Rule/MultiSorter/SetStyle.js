/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetStyle(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    multiSorterProxy.setStyle("ObjectCardBackground", "MultiSorter")
    .setStyle("ChartContentTitle", "Caption")
    .setStyle("ObjectHeaderChartTrendTitle", "Items/DisplayValue")
    .setStyle("ObjectHeaderChartTitle", "Items/DirectionLabel")
    multiSorterProxy.redraw();
}