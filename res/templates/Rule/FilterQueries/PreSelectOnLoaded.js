export default function PreSelectOnLoaded(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTable = pageProxy.getControl('SectionedTable');
  if (sectionedTable) {
    clientAPI.getClientData().preSelectFilters = sectionedTable.filters;
    clientAPI.getClientData().preSelectFiltersString = JSON.stringify(sectionedTable.filters);
    clientAPI.getClientData().preSelectFiltersString2 = clientAPI.convertFilterCriteriaArrayToJSONString(sectionedTable.filters);
  }
}
