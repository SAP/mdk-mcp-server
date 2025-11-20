export default function SwitchVisible(context) {
  let mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  let mainPageData = mainPage.getClientData();
  if (mainPageData) {
    mainPageData['GroupD_Visible'] = mainPageData['GroupD_Visible'] ? false : true;
    mainPageData['GroupD_DatePicker_Value'] = mainPageData['GroupD_DatePicker_Value'] === '2022-10-05T14:48:00.000Z' ? (new Date()).toISOString() : '2022-10-05T14:48:00.000Z';
    mainPageData['GroupD_DatePicker_Mode'] = mainPageData['GroupD_DatePicker_Mode'] === 'Date' ? 'Time' : 'Date';
    mainPageData['GroupD_SectionQO'] = mainPageData['GroupD_SectionQO'] === '$top=5' ? '$top=1' : '$top=5';
  }
}
