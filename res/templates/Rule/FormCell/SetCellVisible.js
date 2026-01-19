let _switchEnabled = false;

export default function SetCellVisible(controlProxy) {
  const containerProxy = controlProxy.getPageProxy().getControl('FormCellContainer');
  if (!containerProxy.isContainer()) {
    return;
  }
  containerProxy.getControls().forEach(formcellProxy => {
    const controlName = formcellProxy.getName()
    if (controlName === 'TitleFormCellVisiblity' || controlName === 'SimplePropertyFormCellVisibility' || controlName === 'InlineSignatureCellVisibility' || controlName === 'SignatureCellVisibility') {
      formcellProxy.setVisible(_switchEnabled, false);
    }
  });

  _switchEnabled = !_switchEnabled;
  containerProxy.redraw();
}
