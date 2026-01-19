import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellListPickerI18nRegionList(context) {
  const regions = context.getRegions();
  let finalResults = [];
  let obj = new Object();
  obj.DisplayValue = context.localizeText('use_device_region');
  obj.ReturnValue = ' ';
  finalResults.push(obj);
  obj = new Object();
  obj.DisplayValue = context.localizeText('invalid_region');
  obj.ReturnValue = 'invalid';
  finalResults.push(obj);

  let listResults = libCom.generateListPickerItems(regions);
  listResults = libCom.sortListPickerByDisplayValue(listResults);
  return finalResults.concat(listResults);
}
