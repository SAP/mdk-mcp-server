export default function FilterResults(clientAPI) {
  //In this example, result1, result2 and so on are filterCritera objects since only filters and sorter is being used
  //If we use other controls like SimplePropertyFormCell as in result6, it just return the values what we type in there or select.
  //By using that one we need to contruct the filterResults array.
  let result1 = clientAPI.evaluateTargetPath('#Page:FilterPage/#Control:Int64/#Value');
  let result2 = clientAPI.evaluateTargetPath('#Page:FilterPage/#Control:String/#Value');
  let result3 = clientAPI.evaluateTargetPath('#Page:FilterPage/#Control:Date/#Value');
  let result4 = clientAPI.evaluateTargetPath('#Page:FilterPage/#Control:Double/#Value');
  let result5 = clientAPI.evaluateTargetPath('#Page:FilterPage/#Control:LogicalOperator/#Value');
  let result6 = clientAPI.evaluateTargetPath('#Page:FilterPage/#Control:SimpleProperty1/#Value');


  let filterResults = [result1, result2, result3, result4, result5];
  
  if (result6 !== '' && result6 !== undefined) {
    // cache the result on parent page to populate the input controls when reopening filter page.
    let temp = {};
    temp.controlName = 'SimpleProperty1';
    temp.value = result6;
    let clientData = clientAPI.evaluateTargetPath('#Page:FormCellTestPage1').context.clientData;
    clientData.filterPageResults = [temp];

    result6 = ["requiredComplex/city eq '" + result6 + "'"];
    let filterResult6 = clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Filter, undefined, undefined, result6, true);
    filterResults.push(filterResult6);
  }
  return filterResults;
}
