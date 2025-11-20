export default function ToggleVisibility(controlProxy) {
  const containerProxy = controlProxy.getPageProxy().getControl('SectionedTable');
  if (!containerProxy.isContainer()) {
    return;
  }

  let fControls = containerProxy.getControls();
  let controls = fControls.map(control => {
    if (control.getName().startsWith('MDKVisible')) {
      return control;
    } 
  });

  controls.forEach(control => {
    if (control) {
      let visible = control.visible != undefined ? !control.visible : false;
      control.visible = visible;
    }
  });

}
