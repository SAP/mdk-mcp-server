export default function ListPickerDisplayValueRule(controlProxy) {
  let containerProxy = controlProxy.getPageProxy().getControl('FormCellContainer');
  if (!containerProxy || !containerProxy.isContainer()) {
    return;
  }
  let listPickerProxy = containerProxy.getControl('ListPicker1');
  let collection = listPickerProxy.getCollection();
  let  formattedCollection = collection.map((data) =>  {
    data.DisplayValue = data.DisplayValue.toLocaleUpperCase();
    return data
  });
  return formattedCollection;
}