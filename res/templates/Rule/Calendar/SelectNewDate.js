export default function SelectNewDate(context) {
  if (context.getValue()) {
    let calendarProxy = context.getPageProxy().getControl('SectionedTable').getSection('CalendarSection');
    calendarProxy.setSelectedDate(context.getValue());
  }
}
