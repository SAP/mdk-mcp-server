
export default function ToggleStyleFlag(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  cd.styleFlag = !cd.styleFlag;
  //controlProxy.getPageProxy().getControl('SectionedTable').redraw();
  controlProxy.getPageProxy().redraw();
}
