export default function CalendarOptionValue(context) {
  let controlName = context._context.clientAPIProps.bindingProperty;
  let pageProxy = context.getPageProxy();
  let switchControlName;
  let pickerControlName;
  if (controlName === 'StartDate' || controlName === 'EndDate') {
    switchControlName = 'CalendarLimitSwitch';
    if (controlName === 'StartDate') {
      pickerControlName = 'CalendarStartDatePicker';
    } else {
      pickerControlName = 'CalendarEndDatePicker';
    }
  } else if (controlName === 'SelectedDate') {
    switchControlName = 'CalendarSelectedDateSwitch';
    pickerControlName = 'CalendarSelectedDatePicker';
  } else if (controlName === 'SelectedDateRange.StartDate' || controlName === 'SelectedDateRange.EndDate') {
    switchControlName = 'CalendarSelectedDateRangeSwitch';
    if (controlName === 'SelectedDateRange.StartDate') {
      pickerControlName = 'CalendarSelectedStartDatePicker';
    } else {
      pickerControlName = 'CalendarSelectedEndDatePicker';
    }
  }
  let calSwitchControl = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:' + switchControlName);
  if (calSwitchControl) {
    let calSwitchValue = calSwitchControl.getValue();
    if (calSwitchValue) {
      let calDateControl = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:' + pickerControlName);
      if (calDateControl) {
        let newValue = calDateControl.getValue();
        if (newValue) {
          return newValue;
        }
      }
    } 
  }
  
  return undefined;
}