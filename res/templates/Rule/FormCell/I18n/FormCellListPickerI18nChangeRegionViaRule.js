import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellListPickerI18nChangeRegionViaRule(controlClientAPI) {
  var needToSetRegion = true;
  var listPickerCell = controlClientAPI.evaluateTargetPathForAPI('#Page:I18nSettings/#Control:RegionListPickerViaRule');
  var selectedRegion = listPickerCell.getValue()[0].ReturnValue;

  if (libCom.isListPickerSelectionEmpty(selectedRegion)) {
    selectedRegion = '';
  }

  var currentAppRegion = controlClientAPI.getRegion();
  if (currentAppRegion && selectedRegion) {
    needToSetRegion = selectedRegion != currentAppRegion;
  }

  if (needToSetRegion) {
    try {
      controlClientAPI.setRegion(selectedRegion);

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
      listPickerCell.setValue(currentAppRegion);
      controlClientAPI.executeAction('/MDKDevApp/Actions/Messages/SetRegionFailureMessage.action');
    }
  }
  
}