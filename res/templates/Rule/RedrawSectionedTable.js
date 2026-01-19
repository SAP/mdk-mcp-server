export default function RedrawSectionedTable(pageProxy) {
  // let clientData = pageProxy.getClientData();
  // clientData.HeaderRedraw = true;
  pageProxy.getControl('SectionedTable').redraw(true);
}