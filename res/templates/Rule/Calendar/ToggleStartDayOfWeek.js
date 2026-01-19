import RedrawCalendarSection from "./RedrawCalendarSection";

export default function ToggleStartDayOfWeek(context) {
  let pageProxy = context.getPageProxy();
  let pageClientData = context.getPageProxy().getClientData();
  let sectionTableProxy = pageProxy.getControl('SectionedTable');
  let formCellSectionProxy = sectionTableProxy.getSection('FormCellSection1');

  pageClientData['ToggleStartDayOfWeek'] = context.getValue();
  
  formCellSectionProxy.getControl('StartDayOfWeek').visible = context.getValue();
  if (!context.getValue()) {
    pageClientData['ToggleStartDayOfWeek'] = false;
  }
  
  RedrawCalendarSection(context);
}