export default function ResetFilters(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTable = pageProxy.getControl('SectionedTable');
  if (sectionedTable) {
    sectionedTable.filters = [];
  }
}
