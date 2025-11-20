export default function RedrawCalendarSection(context) {
  let pageProxy = context.getPageProxy();
  let pageClientData = pageProxy.getClientData();
  let sectionTableProxy = pageProxy.getControl('SectionedTable');
  let formCellSectionProxy = sectionTableProxy.getSection('FormCellSection1');

  pageClientData['CalendarType'] = formCellSectionProxy.getControl('CalendarType').getValue()[0].ReturnValue;
  pageClientData['CalendarIsPersistentSelection']  = formCellSectionProxy.getControl('TogglePersistentSelection').getValue();
  pageClientData['CalendarDefaultSelectedDate']  = formCellSectionProxy.getControl('DefaultSelectedDate').getValue();

  if (pageClientData['IsLimitingCalendarDisplayedDateRange']) {
    pageClientData['CalendarStartDate']  = formCellSectionProxy.getControl('StartDate').getValue();
    pageClientData['CalendarEndDate']  = formCellSectionProxy.getControl('EndDate').getValue();
  }
  else {
    pageClientData['CalendarStartDate']  = null;
    pageClientData['CalendarEndDate']  = null;
  }

  if (pageClientData["ToggleStartDayOfWeek"]) {
    pageClientData['CalendarStartDayOfWeek']  = formCellSectionProxy.getControl('StartDayOfWeek').getValue()[0].ReturnValue;
  } else {
    pageClientData['CalendarStartDayOfWeek'] = null;
  }

  return sectionTableProxy.getSection('CalendarSection').redraw(true);
}