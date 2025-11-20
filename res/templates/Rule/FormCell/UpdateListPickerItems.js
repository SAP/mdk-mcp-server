export default function UpdateListPickerItems(controlProxy) {
  let selection = controlProxy.getValue()[0].ReturnValue;
  let containerProxy = controlProxy.getPageProxy().getControl('FormCellContainer');
  if (!containerProxy.isContainer()) {
    return;
  }
  let listPickerProxy = containerProxy.getControl('ListPickerFormCellSingle');
  let specifier = listPickerProxy.getTargetSpecifier();
  specifier.setDisplayValue("{OrderDescription}");
  specifier.setReturnValue("{OrderId}");
  specifier.setEntitySet("MyWorkOrderHeaders");
  specifier.setService("/MDKDevApp/Services/Amw.service");

  switch (selection) {
    case 'Low':
      specifier.setQueryOptions("$top=5");
      break;
    case 'Medium':
      specifier.setQueryOptions("$top=10");
      break;
    case 'High':
      specifier.setQueryOptions("$top=15");
      break;
  }

  listPickerProxy.setTargetSpecifier(specifier).then(() => {
    listPickerProxy.setValue(['4000189']);
  })
}