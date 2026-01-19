export default function EditableCells(controlProxy) {
  const switchEnabled = controlProxy.getValue();
  const containerProxy = controlProxy.getPageProxy().getControl('FormCellContainer');
  if (!containerProxy.isContainer()) {
    return;
  }
  containerProxy.getControls().forEach(formcellProxy => {
    if (formcellProxy.getName() != 'ToggleEditability' &&
      formcellProxy.getName() != 'ToggleEnabled' &&
      formcellProxy.getName() != 'InvisibleControl' &&
      formcellProxy.getName() != 'InvisibleControl2') {
      formcellProxy.setEditable(switchEnabled);
    }
  });
}
