export default function ToggleCellVisibility(controlProxy) {
  const switchEnabled = controlProxy.getValue();
  const containerProxy = controlProxy.getPageProxy().getControl('FormCellContainer');
  if (!containerProxy.isContainer()) {
    return;
  }
  containerProxy.getControls().forEach(formcellProxy => {
    const controlName = formcellProxy.getName()
    if (controlName === 'TitleFormCellVisiblity' || controlName === 'SimplePropertyFormCellVisibility' || controlName === 'InlineSignatureCellVisibility' || controlName === 'SignatureCellVisibility') {
      formcellProxy.visible = switchEnabled;
    }
  });
}
