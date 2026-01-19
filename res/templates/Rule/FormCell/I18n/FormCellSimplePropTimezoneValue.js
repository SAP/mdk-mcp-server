import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellSimplePropTimezoneValue(context) {
  let selectedValue = '';
  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  if (mainPageData) {
    if (mainPageData.hasOwnProperty('CustomTimezone')) {
      selectedValue = mainPageData.CustomTimezone;
    }
  }

  return selectedValue;
}
