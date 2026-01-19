export default function PreSelectFiltersMultiSorter(clientAPI) {
  return clientAPI.getDefinitionValue('/MDKDevApp/Globals/QueryString1.global').then((orderIDQueryString) => {
    let filterItems = ['Priority asc', 'OrderId desc'];
    let result = [
      //clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Sorter, 'OrderBy', undefined, ['Priority, OrderId'], false),
      //createFilterCriteria(filterType: FilterType, name: string, caption: string, filterItems: Array<object>, isFilterItemsComplex?: boolean, label?, filterItemsDisplayValue?): FilterCriteria;
      clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Sorter, 'OrderBy', undefined, filterItems, false,'Order By')
    ];
    return result;
  });
}
