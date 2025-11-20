export default function GetQueryOptionWithListPickerReturnValue(controlProxy) {
  let containerProxy = controlProxy.getControl('PageOneFormCell');
  if (!containerProxy.isContainer()) {
    return;
  }
  let listPickerProxy = containerProxy.getControl('EquipmentList');
  if (listPickerProxy.getValue().length > 0) {
      let selectedValue = listPickerProxy.getValue()[0].ReturnValue;
      return `$filter=EquipId eq '${selectedValue}'`
  }
  return;
}