export default function FilterResultsFromTabs(clientAPI) {
  let filterResults = [];
  let currentFilters = [];
  if (clientAPI.getPageProxy() && clientAPI.getPageProxy().getFilter()) {
    // with tabs as filter pages and PreloadTabs is not set as [-1], 
    // if the tab page is not opened, the filters for the unopened tab page will not be available.
    // workaround: use current filters to get the filters for the unopened tab page
    // if FilterProperty is string => filter._name is FilterProperty itself. e.g. BusinessArea, listpickers
    // if FilterProperty is an object with name and values => filter._name is name of the object. e.g. Priority
    // if FilterProperty is an array of DisplayValue and ReturnValue objects => filter._name is _Name of the formcell. e.g. OrderId
    // For non FilterProperty filters (including complex query filter) => filter._name is null, use filter._label instead. e.g. sorter and custom complex query filters
    // currentFilters = clientAPI.getPageProxy().getFilter().getFilters(); // enable this line only if PreloadTabs is not set as [-1]
  }
  let fccTabPageProxy = clientAPI.evaluateTargetPathForAPI('#Page:FilterFormCellContainerTabPage');
  if (fccTabPageProxy && fccTabPageProxy.getControls() && fccTabPageProxy.getControls().length > 0) {
    filterResults.push(clientAPI.evaluateTargetPath('#Page:FilterFormCellContainerTabPage/#Control:BusinessArea/#Value'));
    filterResults.push(clientAPI.evaluateTargetPath('#Page:FilterFormCellContainerTabPage/#Control:IDQuery/#Value'));
    filterResults.push(clientAPI.evaluateTargetPath('#Page:FilterFormCellContainerTabPage/#Control:OrderId/#FilterValue'));
  } else if (currentFilters && currentFilters.length > 0) {
    currentFilters.forEach(filter => {
      // filter._name is referring to FilterProperty of the formcell instead of _Name of the formcell.
      if (filter._name === 'BusinessArea' || filter._name === 'IDQuery' || filter._name === 'OrderId') {
        filterResults.push(filter);
      }
    });
  }
  let sorterTabPageProxy = clientAPI.evaluateTargetPathForAPI('#Page:SorterTabPage');
  if (sorterTabPageProxy && sorterTabPageProxy.getControls() && sorterTabPageProxy.getControls().length > 0) {
    filterResults.push(clientAPI.evaluateTargetPath('#Page:SorterTabPage/#Control:OrderBy/#Value'));
  } else if (currentFilters && currentFilters.length > 0) {
    // for first tab page can be skipped as it is always loaded.
    // for sorter formcell, can only use _label to get the filter.
    currentFilters.forEach(filter => {
      if (filter._label === 'Order By') {
        filterResults.push(filter);
      }
    });
  }
  let fcsTabPageProxy = clientAPI.evaluateTargetPathForAPI('#Page:FilterFormCellSectionTabPage');
  if (fcsTabPageProxy && fcsTabPageProxy.getControls() && fcsTabPageProxy.getControls().length > 0) { 
    filterResults.push(clientAPI.evaluateTargetPath('#Page:FilterFormCellSectionTabPage/#Control:Prio/#Value'));
    filterResults.push(clientAPI.evaluateTargetPath('#Page:FilterFormCellSectionTabPage/#Control:HeaderEquipment/#FilterValue'));
  } else if (currentFilters && currentFilters.length > 0) {
    // filter._name is referring to FilterProperty of the formcell instead of _Name of the formcell.
    currentFilters.forEach(filter => {
      if (filter._name === 'Priority' || filter._name === 'HeaderEquipment') {
        filterResults.push(filter);
      }
    });
  }

  return filterResults;
}
