import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellSimplePropScientificValue(context) {
  var valueToBeConverted = 123456.789;

  let selectedLocale = null;
  let selectedMaxFractionDigits = null;
  let selectedThousandSeparators = null;

  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  if (mainPageData) {
    if (mainPageData.hasOwnProperty('CustomLocale')) {
      if (mainPageData.CustomLocale !== '') {
        selectedLocale = mainPageData.CustomLocale;
      }
    }
    if (mainPageData.hasOwnProperty('CustomMaxFractionDigits')) {
      if (mainPageData.CustomMaxFractionDigits !== '') {
        selectedMaxFractionDigits = mainPageData.CustomMaxFractionDigits;
      }
    }
    if (mainPageData.hasOwnProperty('CustomUseSeparators')) {
      if (mainPageData.CustomUseSeparators !== '') {
        selectedThousandSeparators = mainPageData.CustomUseSeparators;
      }
    }
  }

  let options = {
    maximumFractionDigits: selectedMaxFractionDigits,
    useGrouping: selectedThousandSeparators,
  }

  return context.formatScientific(valueToBeConverted, selectedLocale, options);
}
