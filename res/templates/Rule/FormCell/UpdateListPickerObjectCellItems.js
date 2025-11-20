export default function UpdateListPickerObjectCellItems(controlProxy) {
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