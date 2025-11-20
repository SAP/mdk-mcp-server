export default function InitializeCalendarProps(context) {
  let pageProxy = context.getPageProxy();
  let pageClientData = pageProxy.getClientData();
  let sectionTableProxy = pageProxy.getControl('SectionedTable');
  let formCellSectionProxy = sectionTableProxy.getSection('FormCellSection1');

  let initialDefaultSelectedDate = new Date('2025-06-23').toISOString().substring(0, 19) + 'Z';

  formCellSectionProxy.getControls().forEach(formcellProxy => {
    switch (formcellProxy.getName()) {
      case 'CalendarType':
        formcellProxy.setValue('Month');
        break;
      case 'StartDayOfWeek':
        formcellProxy.visible = false;
        break;
      case 'TogglePersistentSelection':
        formcellProxy.setValue(true);
        break;
      case 'ToggleLimitDisplayedDateRange':
        formcellProxy.setValue(false);
        break;
      case 'ToggleStartDayOfWeek':
        formcellProxy.setValue(false);
        break;
      case 'StartDate':
        formcellProxy.visible = false;
        break;
      case 'EndDate':
        formcellProxy.visible = false;
        break;
      case 'DefaultSelectedDate':
        formcellProxy.setValue(initialDefaultSelectedDate);
    }
  });
  pageClientData['IsLimitingCalendarDisplayedDateRange'] = false;
  pageClientData["ToggleStartDayOfWeek"] = false;
  pageClientData['CalendarType'] = 'Month';
  pageClientData['CalendarStartDayOfWeek']  = "";
  pageClientData['CalendarIsPersistentSelection']  = true;
  pageClientData['CalendarDefaultSelectedDate']  = "";
  pageClientData['CalendarStartDate']  = "";
  pageClientData['CalendarEndDate']  = "";
  pageClientData['CalendarDefaultSelectedDate'] = initialDefaultSelectedDate;
}