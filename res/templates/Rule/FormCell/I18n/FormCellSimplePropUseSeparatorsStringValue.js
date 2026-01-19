import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellSimplePropUseSeparatorsStringValue(context) {
  let selectedValue = '';
  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  if (mainPageData) {
    if (mainPageData.hasOwnProperty('CustomUseSeparators')) {
      selectedValue = mainPageData.CustomUseSeparators;
    }
  }

  return selectedValue;
}
