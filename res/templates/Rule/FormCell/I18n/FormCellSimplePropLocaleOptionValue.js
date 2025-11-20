import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellSimplePropLocaleOptionValue(context) {
  let selectedValue = '';
  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  if (mainPageData) {
    if (mainPageData.hasOwnProperty('CustomLocale')) {
      selectedValue = mainPageData.CustomLocale;
    }
  }

  return selectedValue;
}
