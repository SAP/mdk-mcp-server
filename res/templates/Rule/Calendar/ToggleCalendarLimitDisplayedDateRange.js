import RedrawCalendarSection from "./RedrawCalendarSection";

export default function ToggleCalendarLimitDisplayedDateRange(context) {
  let pageProxy = context.getPageProxy();
  let pageClientData = context.getPageProxy().getClientData();
  let sectionTableProxy = pageProxy.getControl('SectionedTable');
  let formCellSectionProxy = sectionTableProxy.getSection('FormCellSection1');

  pageClientData['IsLimitingCalendarDisplayedDateRange'] = context.getValue();
  
  formCellSectionProxy.getControl('StartDate').visible = context.getValue();
  formCellSectionProxy.getControl('EndDate').visible = context.getValue();
  if (!context.getValue())
  {
    pageClientData['CalendarStartDate'] = null;
    pageClientData['CalendarEndDate'] = null;
    RedrawCalendarSection(context);
  }
}