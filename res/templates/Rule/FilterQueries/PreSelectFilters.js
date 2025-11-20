export default function PreSelectFilters(clientAPI) {
  return clientAPI.getDefinitionValue('/MDKDevApp/Globals/QueryString1.global').then((orderIDQueryString) => {
    let result = [
      clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Sorter, 'OrderBy', undefined, [
        'Priority, OrderId'
      ], false),

      clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Filter, undefined, undefined, [
        orderIDQueryString
      ], true),
      clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Filter, 'Priority', undefined, [
        '1',
        '2'
      ], false),
      clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Filter, 'OrderType', undefined, [
        'PM01',
        'PM02'
      ], false, 'Tag', ['PM-01', 'PM-02']),
      clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Filter, undefined, undefined, [
        "OrderId gt '4000020'"
      ], true)
    ];

    return result;
  });
}
