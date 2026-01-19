export default function CalendarOptionEditableValue(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  let switchControlName;  
  if (controlName === 'CalendarSelectedDateSwitch' || controlName === 'CalendarSelectedDateRangeSwitch') {
    switchControlName = 'CalendarTypeSegmented';
  }
  if (controlName === 'CalendarStartDatePicker' || controlName === 'CalendarEndDatePicker') {
    switchControlName = 'CalendarLimitSwitch';
  } else if (controlName === 'CalendarSelectedDatePicker') {
    switchControlName = 'CalendarSelectedDateSwitch';
  }
  let calSwitchControl = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:' + switchControlName);
  if (calSwitchControl) {
    let calSwitchValue = calSwitchControl.getValue();
    if (calSwitchValue === true) {
      return true
    } else  if (calSwitchValue === false) {
      return false
    } else if (calSwitchValue && calSwitchValue.length > 0 && calSwitchValue[0]) {
      if (calSwitchValue[0].ReturnValue === 'DateRange') {
        if (controlName === 'CalendarSelectedDateRangeSwitch') {
          return true;
        } else if (controlName === 'CalendarSelectedDateSwitch') {
          return false;
        }
      } else {
        if (controlName === 'CalendarSelectedDateRangeSwitch') {
          return false;
        } else if (controlName === 'CalendarSelectedDateSwitch') {
          return true;
        }
      }
    }
  }
  return false;
}