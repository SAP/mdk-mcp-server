export default function UpdateListPickerObjectCellItemsOneOrMany(controlProxy) {
  let selection = controlProxy.getValue()[0].ReturnValue;
  let containerProxy = controlProxy.getPageProxy().getControl('FormCellContainer');
  if (!containerProxy.isContainer()) {
    return;
  }
  let listPickerProxy = containerProxy.getControl('ListPickerFormCellObjectCellSingle2');
  let specifier = listPickerProxy.getTargetSpecifier();
  specifier.setObjectCell({
    Title: "{OrderDescription}",
    Subhead: "{OrderId}",
    DetailImage: "/MDKDevApp/Images/workorder.png"
  });
  specifier.setReturnValue("{OrderId}");
  specifier.setEntitySet("MyWorkOrderHeaders");
  specifier.setService("/MDKDevApp/Services/Amw.service");

  switch (selection) {
    case 'One Item':
      specifier.setQueryOptions("$top=1");
      break;
    case 'Many Items':
      specifier.setQueryOptions("$top=20");
      break;
  }

  listPickerProxy.setTargetSpecifier(specifier);
}