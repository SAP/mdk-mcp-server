export default function SaveFilters(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTable = pageProxy.getControl('SectionedTable');
  if (sectionedTable) {
    const r = sectionedTable.filters;
    const str = JSON.stringify(r);
    clientAPI.getClientData().currentFilters = r;
    clientAPI.getClientData().currentFiltersString = str;
    clientAPI.getClientData().currentFiltersString2 = clientAPI.convertFilterCriteriaArrayToJSONString(sectionedTable.filters);
    console.log(clientAPI.getClientData().currentFiltersString);
    console.log(clientAPI.getClientData().currentFiltersString2);
    alert('saved current filters:\n\n' + str);
  }
}
