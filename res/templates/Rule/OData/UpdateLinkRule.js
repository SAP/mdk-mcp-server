export default function UpdateLinkRule(ClientAPI) {

  let containerProxy = ClientAPI.getControl('PageOneFormCell');
  let listPickerProxy = containerProxy.getControl('EquipmentList');
  let queryOption = '';
  // odata action expects link array
  let links = [];
  if (listPickerProxy.getValue().length > 0) {
      let selectedValue = listPickerProxy.getValue()[0].ReturnValue;
      queryOption = `$filter=EquipId eq '${selectedValue}'`
      let link = ClientAPI.createLinkSpecifierProxy('Equipment', 'MyEquipments', queryOption, '');
      links.push(link.getSpecifier());
  } 
  return links;
}