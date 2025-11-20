export default function FormCellListPickerI18nOptionsSetValue(context) {
  
  // store current selected options into client data
  let selectedLocale = null;
  try {
    const listPickerCell = context.evaluateTargetPathForAPI('#Page:ModalI18nNumberOptionsPage/#Control:LocaleListPicker');
    selectedLocale = listPickerCell.getValue()[0].ReturnValue;
    if (libCom.isListPickerSelectionEmpty(selectedLocale)) {
      selectedLocale = null;
    }
  } catch (err) {
    console.log(err);
  }

  let selectedMaxFractionDigits = null;
  try {
    const listPickerCell = context.evaluateTargetPathForAPI('#Page:ModalI18nNumberOptionsPage/#Control:MaxFractionListPicker');
    selectedMaxFractionDigits = listPickerCell.getValue()[0].ReturnValue;
    if (libCom.isListPickerSelectionEmpty(selectedMaxFractionDigits)) {
      selectedMaxFractionDigits = null;
    }
  } catch (err) {
    console.log(err);
  }

  let selectedThousandSeparators = null;
  try {
    const buttonCell = context.evaluateTargetPathForAPI('#Page:ModalI18nNumberOptionsPage/#Control:UseSeparatorButton');
    selectedThousandSeparators = buttonCell.getValue();
  } catch (err) {
    console.log(err);
  }
  
  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  if (selectedLocale) {
    mainPageData['CustomLocale'] = selectedLocale;
  }
  if (selectedMaxFractionDigits) {
    mainPageData['CustomMaxFractionDigits'] = selectedMaxFractionDigits.toString();
  }
  if (selectedThousandSeparators !== null) {
    mainPageData['CustomUseSeparators'] = selectedThousandSeparators.toString();
  }
}
