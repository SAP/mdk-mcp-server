import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellSimplePropDateEmptyValue(context) {
  var valueToBeConverted = '';

  let selectedLocale = null;
  let selectedTimezone = null;

  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  if (mainPageData) {
    if (mainPageData.hasOwnProperty('CustomDateTimeLocale')) {
      if (mainPageData.CustomDateTimeLocale !== '') {
        selectedLocale = mainPageData.CustomDateTimeLocale;
      }
    }
    if (mainPageData.hasOwnProperty('CustomTimezone')) {
      if (mainPageData.CustomTimezone !== '') {
        selectedTimezone = mainPageData.CustomTimezone;
      }
    }
  }

  return context.formatDate(valueToBeConverted, selectedLocale, selectedTimezone);
}
