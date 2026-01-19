export default function CalendarRedraw(context) {
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let sectionedTableProxy = pageProxy.getControl('SectionedTable');
    if (sectionedTableProxy) {
    let sectionProxy = sectionedTableProxy.getSection('CalendarSection');
      if (sectionProxy) {
        sectionProxy.redraw();
      }
    }
  }
}