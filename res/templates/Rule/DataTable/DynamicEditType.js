/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function DynamicEditType(clientAPI) {
    let dataTablePage = clientAPI.evaluateTargetPathForAPI('#Page:DataTableNoneMode');
	let pageData = dataTablePage.getClientData();
    
    if (!pageData.hasOwnProperty('rowIndex') || pageData['rowIndex'] >= 20) {
        pageData['rowIndex'] = 0;
    }
    let rowIndex = pageData['rowIndex'];
    //console.log("rowIndex is: " + rowIndex);
    const pageProxy = clientAPI.getPageProxy();
    const sectionedTable = pageProxy.getControl('SectionedTable');
    const section = sectionedTable.getSection('DataTableSection');
    pageData['rowIndex'] += 1;
    let cell = section.getCell(rowIndex, 4);
    let value = Number(cell.getValue());
    if(value > 2) {
        return 'None';
    } else {
        return 'Text';
    }
}