export default function FormCellListPickerDateTimeOptionsChangeValuesViaRule(context) {
  let settingsPageProxy = context.evaluateTargetPathForAPI('#Page:I18nDateTimeDisplayViaAPI');
  if (settingsPageProxy.getControls()) {
    var controlsInSettingsPage = settingsPageProxy.getControls();
    for (var i = 0; i < controlsInSettingsPage.length; i++) {
      controlsInSettingsPage[i].redraw();
    }
  }
  
  context.executeAction('/MDKDevApp/Actions/Navigation/ClosePage.action');
}
