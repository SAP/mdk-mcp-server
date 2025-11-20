export default function ScrollToDate(context) {
  if (context.getValue()) {
    let calendarProxy = context.getPageProxy().getControl('SectionedTable').getSection('CalendarSection');
    calendarProxy.scrollToDate(context.getValue());
  }
}
