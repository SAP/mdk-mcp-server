import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellListPickerI18nChangeValuesViaRule(controlClientAPI) {
  var needToSetLanguage = true;
  var listPickerCell = controlClientAPI.evaluateTargetPathForAPI('#Page:I18nSettings/#Control:LanguageListPickerViaRule');
  var selectedLanguage = listPickerCell.getValue()[0].ReturnValue;

  if (libCom.isListPickerSelectionEmpty(selectedLanguage)) {
    selectedLanguage = '';
  }

  var currentAppLanguage = controlClientAPI.getLanguage();
  if (currentAppLanguage && selectedLanguage) {
    needToSetLanguage = selectedLanguage != currentAppLanguage;
  }

  if (needToSetLanguage) {
    try {
      controlClientAPI.setLanguage(selectedLanguage);

      // redraw i18nSettings page (actionbar and toolbar)
      var settingsPageProxy = controlClientAPI.evaluateTargetPathForAPI('#Page:I18nSettings');
      settingsPageProxy.redraw();

      // redraw controls inside i18nSettings page (formcellcontainer)
      if (settingsPageProxy.getControls()) {
        var controlsInSettingsPage = settingsPageProxy.getControls();
        for (var i = 0; i < controlsInSettingsPage.length; i++) {
          controlsInSettingsPage[i].redraw();
        }
      }

      // redraw i18nExamples page (actionbar and toolbar)
      var examplesPageProxy = controlClientAPI.evaluateTargetPathForAPI('#Page:I18nExamples');
      examplesPageProxy.redraw();

      // redraw controls inside i18nExamples page (sectionedtable)
      if (examplesPageProxy.getControls()) {
        var controlsInExamplesPage = examplesPageProxy.getControls();
        for (var i = 0; i < controlsInExamplesPage.length; i++) {
          controlsInExamplesPage[i].redraw();
        }
      }
    } catch (ex) {
      listPickerCell.setValue(currentAppLanguage);
      controlClientAPI.executeAction('/MDKDevApp/Actions/Messages/SetLanguageFailureMessage.action');
    }
  }
  
}