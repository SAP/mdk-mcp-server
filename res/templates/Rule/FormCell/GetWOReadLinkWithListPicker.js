export default function GetWOReadLinkWithListPicker(controlProxy) {
  let containerProxy = controlProxy.getControl('PageOneFormCell');
  if (!containerProxy.isContainer()) {
    return;
  }
  let listPickerProxy = containerProxy.getControl('WorkOrderList');
  if (listPickerProxy.getValue().length > 0) {
      let selectedValue = listPickerProxy.getValue()[0].ReturnValue;
      return selectedValue
  }
  return;
}