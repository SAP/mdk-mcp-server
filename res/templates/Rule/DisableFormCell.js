export default function DisableFormCell(controlProxy) {
  const switchEnabled = controlProxy.getValue();
  const containerProxy = controlProxy.getPageProxy().getControl('FormCellContainer');
  if (!containerProxy.isContainer()) {
    return;
  }
  containerProxy.getControls().forEach(formcellProxy => {
    if (formcellProxy.getName() != 'MasterSwitchCell') {
      formcellProxy.setEditable(!switchEnabled);
    }
  });
}
