export default function FormCellListPickerI18nOptionsChangeValuesViaRule(context) {
  let settingsPageProxy = context.evaluateTargetPathForAPI('#Page:I18nNumberDisplayViaAPI');
  if (settingsPageProxy.getControls()) {
    var controlsInSettingsPage = settingsPageProxy.getControls();
    for (var i = 0; i < controlsInSettingsPage.length; i++) {
      controlsInSettingsPage[i].redraw();
    }
  }
  
  context.executeAction('/MDKDevApp/Actions/Navigation/ClosePage.action');
}
