/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function getFilterResult(clientAPI) {   
    const pageProxy = clientAPI.getPageProxy();
    const sectionedTable = pageProxy.getControl('SectionedTable');
    let filterResult = sectionedTable.getFilterActionResult();
    let sorterResult = sectionedTable.getSorterActionResult();

    alert("filter is: " + filterResult + " and sorter is: " + sorterResult);
}