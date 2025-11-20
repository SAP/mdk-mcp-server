export default function FormCellListPickerI18nOptionsResetViaRule(context) {
  const mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  mainPageData['CustomLocale'] = '';
  mainPageData['CustomMaxFractionDigits'] = '';
  mainPageData['CustomUseSeparators'] = '';
  
  let settingsPageProxy = context.evaluateTargetPathForAPI('#Page:I18nNumberDisplayViaAPI');
  if (settingsPageProxy.getControls()) {
    var controlsInSettingsPage = settingsPageProxy.getControls();
    for (var i = 0; i < controlsInSettingsPage.length; i++) {
      controlsInSettingsPage[i].redraw();
    }
  }
  
  context.executeAction('/MDKDevApp/Actions/Navigation/ClosePage.action');
}
