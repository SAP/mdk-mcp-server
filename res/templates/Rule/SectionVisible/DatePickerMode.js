export default function DatePickerMode(context) {
  var mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  var mainPageData = mainPage.getClientData();
  if (mainPageData) {
    return mainPageData['GroupD_DatePicker_Mode'] || 'Date';
  }
  return 'Date';
}
