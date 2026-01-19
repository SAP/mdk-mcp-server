export default function UpdateListPickerItemsOneOrMany(controlProxy) {
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
    case 'One Item':
      specifier.setQueryOptions("$top=1");
      break;
    case 'Many Items':
      specifier.setQueryOptions("$top=15");
      break;
  }

  listPickerProxy.setTargetSpecifier(specifier);
}