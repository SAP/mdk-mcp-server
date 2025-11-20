export default function CalendarAPIOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  
  if (pageProxy) {
    let sectionedTableProxy = pageProxy.getControl('SectionedTable');
    if (sectionedTableProxy) {
      let calendarSectionProxy = sectionedTableProxy.getSection('CalendarSection');
      if (calendarSectionProxy) {
        if (controlName === 'SetDateRangeButton') {
          let selectedDateRange = calendarSectionProxy.getSelectedDateRange();
          if (selectedDateRange) {
            selectedDateRange.startDate = "2025-10-20T00:00:00Z"
            selectedDateRange.endDate = "2025-11-02T00:00:00Z"
          }
          calendarSectionProxy.setSelectedDateRange(selectedDateRange);
        } else if (controlName === 'GetDateRangeButton') {
          let calType = calendarSectionProxy.getType();
          let selectedDateRange = calendarSectionProxy.getSelectedDateRange();
          if (selectedDateRange) {
            let startDateString = selectedDateRange.startDate.toString();
            let endDateString = selectedDateRange.endDate.toString();
            let message = '\nStart date: ' + startDateString + '\nEnd date: ' + endDateString;
            alert('Calendar Type: ' +  calType + '\nSelected Date Range: ' + message);
          }
        } else if (controlName === 'RedrawButton') {
          calendarSectionProxy.redraw();
        }
      }
    }
  }
}