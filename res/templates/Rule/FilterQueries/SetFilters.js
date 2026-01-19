export default function SetFilters(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTable = pageProxy.getControl('SectionedTable');
  if (sectionedTable) {
    if (clientAPI.getClientData().currentFilters) {
      Promise.resolve(alert('use current filters')).then(() => {
        sectionedTable.filters = clientAPI.getClientData().currentFilters;
      });
    } else {
      Promise.resolve(alert('NO current filters found, will use pre-select filters')).then(() => {
        sectionedTable.filters = clientAPI.getClientData().preSelectFilters;
      });
    }
  }
}
