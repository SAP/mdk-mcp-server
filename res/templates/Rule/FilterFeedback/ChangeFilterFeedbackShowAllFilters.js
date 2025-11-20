export default function ChangeFilterFeedbackShowAllFilters(context) {
  // reset existing filters
  const pageProxy = context.getPageProxy();
  const sectionedTable = pageProxy.getControl('SectionedTable');
  if (sectionedTable) {
    sectionedTable.filters = [];
  }
  
  // update ShowAllFilters flag
  let currentValue = pageProxy.getClientData().ShowAllFilters;
  pageProxy.getClientData().ShowAllFilters = !currentValue;
  pageProxy.getClientData().Message = 'Filters have been reset. ShowAllFilters flag updated as ' + !currentValue;
  pageProxy.executeAction('/MDKDevApp/Actions/Messages/AlertMessage.action');
  pageProxy.redraw();
}
