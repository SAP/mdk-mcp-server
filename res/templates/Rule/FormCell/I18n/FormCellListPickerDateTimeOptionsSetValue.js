export default function FormCellListPickerDateTimeOptionsSetValue(context) {
  
  // store current selected options into client data
  let selectedLocale = null;
  try {
    const listPickerCell = context.evaluateTargetPathForAPI('#Page:ModalDateTimeOptionsPage/#Control:DateTimeLocaleListPicker');
    selectedLocale = listPickerCell.getValue()[0].ReturnValue;
    if (libCom.isListPickerSelectionEmpty(selectedLocale)) {
      selectedLocale = null;
    }
  } catch (err) {
    console.log(err);
  }

  let selectedTimezone = null;
  try {
    const listPickerCell = context.evaluateTargetPathForAPI('#Page:ModalDateTimeOptionsPage/#Control:TimezoneListPicker');
    selectedTimezone = listPickerCell.getValue()[0].ReturnValue;
    if (libCom.isListPickerSelectionEmpty(selectedTimezone)) {
      selectedTimezone = null;
    }
  } catch (err) {
    console.log(err);
  }
  
  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  if (selectedLocale) {
    mainPageData['CustomDateTimeLocale'] = selectedLocale;
  }
  if (selectedTimezone) {
    mainPageData['CustomTimezone'] = selectedTimezone;
  }
}
