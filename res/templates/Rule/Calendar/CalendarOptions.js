export default function CalendarOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  
  if (pageProxy) {
    let pageClientData = pageProxy.getClientData();
    let newValue;
    if (controlName === 'CalendarLimitSwitch' || controlName === 'CalendarSelectedDateSwitch' || controlName === 'CalendarSelectedDateRangeSwitch') {
      // triggered from CalenderTestControl page
      let control1, control2;
      if (controlName === 'CalendarLimitSwitch') {
        control1 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarStartDatePicker');
        control2 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarEndDatePicker');
      } else if (controlName === 'CalendarSelectedDateSwitch') {
        control1 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedDatePicker');
      } else if (controlName === 'CalendarSelectedDateRangeSwitch') {
        control1 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedStartDatePicker');
        control2 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedEndDatePicker');
      }

      let promises = [];
      if (control1) {
        promises.push(control1.setEditable(context.getValue()));
      }
      if (control2) {
        promises.push(control2.setEditable(context.getValue()));
      }
      return Promise.all(promises);
    } else {
      let promise = Promise.resolve();
      // triggered from CalenderTestControl page
      if (controlName === 'CalendarHeightSimpleProp') {
        newValue = context.getValue();
        if (newValue) {
          if (isNaN(newValue)) {
            return;
          } else if (newValue < 100) {
            // do nothing if below 100
            return;
          }
        } else if (newValue === '') {
          return;
        }
      }
      if (controlName === 'CalendarTypeSegmented') {
        let control1 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarIsPersistentSelectionSwitch');
        let control2 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedDateSwitch');
        let control3 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedDatePicker');
        let control4 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedDateRangeSwitch');
        let control5 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedStartDatePicker');
        let control6 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedEndDatePicker');
        let control7 = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarHeightSimpleProp');
        let isEditableValue = !(context.getValue() && context.getValue().length > 0 && context.getValue()[0] && context.getValue()[0].ReturnValue === 'DateRange');
        let promises = [];
        if (control1) {
          promises.push(control1.setEditable(isEditableValue));
        }
        if (control2) {
          promises.push(control2.setEditable(isEditableValue));
        }
        if (isEditableValue) {
          if (control2 && control2.getValue() === true && control3) {
            // selected date picker relies on whether selected date switch is turned on
            promises.push(control3.setEditable(true));
          }
        } else {
          if (control3) {
            promises.push(control3.setEditable(isEditableValue));
          }
        }

        if (control4) {
          promises.push(control4.setEditable(!isEditableValue));
        }
        if (control7) {
          promises.push(control7.setEditable(!isEditableValue));
        }
        if (!isEditableValue) {
          if (control4 && control4.getValue() === true) {
            // selected date picker relies on whether selected date switch is turned on
            if (control5) {
              promises.push(control5.setEditable(true));
            }
            if (control6) {
              promises.push(control6.setEditable(true));
            }
          }
        } else {
          if (control5) {
            promises.push(control5.setEditable(!isEditableValue));
          }
          if (control6) {
            promises.push(control6.setEditable(!isEditableValue));
          }
        }

        promise = Promise.all(promises);
      }
      return promise.then(() => {
        let proceedDisplay = true;
        if (controlName === 'CalendarSelectedStartDatePicker' || controlName === 'CalendarSelectedEndDatePicker') {
          let selectedStartDate = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedStartDatePicker');
          let selectedEndDate = pageProxy.evaluateTargetPathForAPI('#Page:CalendarTestControlPage/#Control:CalendarSelectedEndDatePicker');
          let selectedStartDateTime;
          let selectedEndDateTime;
          if (selectedStartDate && selectedStartDate.getValue() instanceof Date) {
            selectedStartDateTime = selectedStartDate.getValue().getTime();
          }
          if (selectedEndDate && selectedEndDate.getValue() instanceof Date) {
            selectedEndDateTime = selectedEndDate.getValue().getTime();
          }
          if (selectedStartDateTime > selectedEndDateTime) {
            proceedDisplay = false;
          }
        }
        if (proceedDisplay) {
          if (context.nativescript.platformModule.device.deviceType === 'Tablet') {
            // only can display flex column pages on tablet
            let testPageProxy = context.evaluateTargetPathForAPI('#Page:CalendarTest');
            if (testPageProxy) {
              let testPageSectionedTableProxy = testPageProxy.getControl('CalendarTestSectionedTable');
              if (testPageSectionedTableProxy) {
                let testPageSectionProxy = testPageSectionedTableProxy.getSection('CalendarSection');
                if (testPageSectionProxy) {
                  testPageSectionProxy.redraw();
                }
              }
            }
          } else {
            let testControlAutoShowModalSwitchValue = pageProxy.evaluateTargetPath('#Control:AutoShowModalSectionSwitch/#Value');
            if (testControlAutoShowModalSwitchValue === true) {
              // for phone will show the calendar page as modal
              pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToModalCalendarTest.action');
            }
          }
        }
      });
    }
  }
}