export default function RedrawCalendar(context) {
  let pageProxy = context.getPageProxy();
  let sectionTableProxy = pageProxy.getControl('SectionedTable');

  return sectionTableProxy.getSection('CalendarSection').redraw(true);
}