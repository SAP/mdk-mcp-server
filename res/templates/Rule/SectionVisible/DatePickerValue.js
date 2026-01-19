export default function DatePickerValue(context) {
  var mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  var mainPageData = mainPage.getClientData();
  if (mainPageData) {
    return mainPageData['GroupD_DatePicker_Value'] || '2022-10-05T14:48:00.000Z';
  }
  return '2022-10-05T14:48:00.000Z';
}
