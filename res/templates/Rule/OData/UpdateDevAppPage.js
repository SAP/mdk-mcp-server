export default function UpdateDevAppPage(pageProxy) {
  let controlProxy = pageProxy.getControl("SectionedTable");
  if (controlProxy) {
    controlProxy.redraw();
  }
}
