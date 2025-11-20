export default function FormCellSegmentedControlStacked(controlClientAPI) {
  let formCellContainerProxy = controlClientAPI.getPageProxy().getControl('FormCellContainer');
  let sectionedTableProxy = controlClientAPI.getPageProxy().getControl("SectionedTable");
  let containerProxy = formCellContainerProxy ?? sectionedTableProxy ?? null;

  if (containerProxy) {
    const switchCellSetSegmentedControl = containerProxy.getControl('SwitchCellSetSegmentedControl');
    const switchValue = switchCellSetSegmentedControl.getValue();
    var currentValue = "CaptionPosition Value:\n";
    const controlNames = ['SegmentedControl1', 'SegmentedControl2', 'SegmentedControl3', 'SegmentedControl4'];
    controlNames.forEach(controlName => {
        const control = containerProxy.getControl(controlName);
        if (switchValue) {
          const captionPosition = "Top";
          control.setCaptionPosition(captionPosition);
        }
        else {
          const captionPosition = "Adaptive";
          control.setCaptionPosition(captionPosition);
        }
        control.redraw();
    });
    controlNames.forEach(controlName => {
      const control = containerProxy.getControl(controlName);
      currentValue += `${controlName}: ${control.getCaptionPosition()}\n`;
    });
    controlClientAPI.getPageProxy().getClientData().Message = currentValue.trimEnd();
    return controlClientAPI.getPageProxy().executeAction('/MDKDevApp/Actions/Messages/AlertMessage.action');
  }
}
