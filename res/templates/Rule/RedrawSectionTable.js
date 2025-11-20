export default function RedrawSectionTable(pageProxy) {
  let clientData = pageProxy.getClientData();
  clientData.HeaderRedraw = true;
  pageProxy.getControl('HeaderSection').getSection('SectionHeader').redraw(true);
}