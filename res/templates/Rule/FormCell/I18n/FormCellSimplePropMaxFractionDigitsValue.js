import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellSimplePropMaxFractionDigitsValue(context) {
  let selectedValue = '';
  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  if (mainPageData) {
    if (mainPageData.hasOwnProperty('CustomMaxFractionDigits')) {
      selectedValue = mainPageData.CustomMaxFractionDigits;
    }
  }

  return selectedValue;
}
