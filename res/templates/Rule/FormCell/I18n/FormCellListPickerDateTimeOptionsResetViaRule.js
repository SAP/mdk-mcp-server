export default function FormCellListPickerDateTimeOptionsResetViaRule(context) {
  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  mainPageData['CustomDateTimeLocale'] = '';
  mainPageData['CustomTimezone'] = '';
  
  let settingsPageProxy = context.evaluateTargetPathForAPI('#Page:I18nDateTimeDisplayViaAPI');
  if (settingsPageProxy.getControls()) {
    var controlsInSettingsPage = settingsPageProxy.getControls();
    for (var i = 0; i < controlsInSettingsPage.length; i++) {
      controlsInSettingsPage[i].redraw();
    }
  }
  
  context.executeAction('/MDKDevApp/Actions/Navigation/ClosePage.action');
}
