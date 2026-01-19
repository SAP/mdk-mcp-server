export default function Redraw(clientAPI) {
  let page = clientAPI.currentPage;
  if (page) {
    page = page.context.clientAPI;
    let table = page.getControl('OnRenderedTable');
    if (table) {
      table.redraw();
    }
  }
}