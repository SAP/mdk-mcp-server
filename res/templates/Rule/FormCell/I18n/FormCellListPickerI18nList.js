import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellListPickerI18nList(context) {
  const supportedLanguages = context.getSupportedLanguages();
  let finalResults = [];
  let obj = new Object();
  obj.DisplayValue = context.localizeText('use_device_language');
  obj.ReturnValue = ' ';
  finalResults.push(obj);
  obj = new Object();
  obj.DisplayValue = context.localizeText('invalid_language');
  obj.ReturnValue = 'invalid';
  finalResults.push(obj);
  let listResults = libCom.generateListPickerItems(supportedLanguages);
  return finalResults.concat(listResults);
}
