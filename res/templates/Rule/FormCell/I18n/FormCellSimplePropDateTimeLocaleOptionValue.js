import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellSimplePropDateTimeLocaleOptionValue(context) {
  let selectedValue = '';
  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  if (mainPageData) {
    if (mainPageData.hasOwnProperty('CustomDateTimeLocale')) {
      selectedValue = mainPageData.CustomDateTimeLocale;
    }
  }

  return selectedValue;
}
