export default function DefaultFilters(clientAPI) {
  return [
    clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Filter, undefined, undefined, [
      "OrderId gt '4000020'"
    ], true)
  ];
}
