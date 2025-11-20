export default function FormCellListPickerPlaceHolder(controlClientAPI) {
  let formCellContainerProxy = controlClientAPI.getPageProxy().getControl('FormCellContainer');
  let sectionedTableProxy = controlClientAPI.getPageProxy().getControl("SectionedTable");
  let containerProxy = formCellContainerProxy ?? sectionedTableProxy ?? null;
  if (containerProxy) {
    const noteCell = containerProxy.getControl('NoteFormCell');
    const newPlaceHolder = noteCell.getValue();
    const switchCellPlaceHolder = containerProxy.getControl('SwitchCellSetPlaceHolder');
    const switchValue = switchCellPlaceHolder.getValue();
    var currentValue = "PlaceHolder Value:\n";
    const controlNames = ['ListPikcerFormCell1', 'ListPikcerFormCell2', 'ListPikcerFormCell3', 'ListPikcerFormCell4'];
    controlNames.forEach(controlName => {
        const control = containerProxy.getControl(controlName);
        if (switchValue === true) {
          control.setPlaceHolder(newPlaceHolder);
        }
        else {
          control.setPlaceHolder('');
        }
        control.redraw();
    });
    controlNames.forEach(controlName => {
      const control = containerProxy.getControl(controlName);
      currentValue += `${controlName}: ${control.getPlaceHolder()}\n`;
    });
    controlClientAPI.getPageProxy().getClientData().Message = currentValue.trimEnd();
    return controlClientAPI.getPageProxy().executeAction('/MDKDevApp/Actions/Messages/AlertMessage.action');
  }
}
