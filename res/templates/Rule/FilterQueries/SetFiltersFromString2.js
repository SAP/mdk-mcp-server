export default function SetFiltersFromString2(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTable = pageProxy.getControl('SectionedTable');
  if (sectionedTable) {
    if (clientAPI.getClientData().currentFiltersString2) {
      Promise.resolve(alert('use current filters string 2')).then(() => {
        sectionedTable.filters = clientAPI.convertJSONStringToFilterCriteriaArray(clientAPI.getClientData().currentFiltersString2);
      });
    } else {
      Promise.resolve(alert('NO current filters string 2 found, will use pre-select filters string 2')).then(() => {
        sectionedTable.filters = clientAPI.convertJSONStringToFilterCriteriaArray(clientAPI.getClientData().preSelectFiltersString2);
      });
    }
  }
}
