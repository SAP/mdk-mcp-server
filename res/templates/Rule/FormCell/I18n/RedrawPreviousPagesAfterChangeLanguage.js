import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function RedrawPreviousPagesAfterChangeLanguage(controlClientAPI) {
  // redraw i18nSettings page (actionbar and toolbar)
  let settingsPageProxy = controlClientAPI.evaluateTargetPathForAPI('#Page:I18nSettings');
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
}
