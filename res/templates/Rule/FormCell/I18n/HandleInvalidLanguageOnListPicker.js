export default function HandleInvalidLanguageOnListPicker(controlClientAPI) {
  var listPickerCell = controlClientAPI.evaluateTargetPathForAPI('#Page:I18nSettings/#Control:LanguageListPicker');
  var currentAppLanguage = controlClientAPI.getLanguage();
  listPickerCell.setValue(currentAppLanguage);
  controlClientAPI.executeAction('/MDKDevApp/Actions/Messages/SetLanguageFailureMessage.action');
}