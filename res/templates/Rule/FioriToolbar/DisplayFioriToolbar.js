export default function DisplayFioriToolbar(context) {
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let sectionedTableProxy = pageProxy.getControl('FioriToolbarSection');
    if (sectionedTableProxy) {
      let helperText = '';
      let customOverflowIcon = false;
      let scenario = '1';
      let helperTextListpicker = sectionedTableProxy.getControl('HelperTextListpicker');
      let customOverflowIconSwitch = sectionedTableProxy.getControl('CustomOverflowIconSwitch');
      let scenarioListpicker = sectionedTableProxy.getControl('ScenarioListpicker');
      if (helperTextListpicker && helperTextListpicker.getValue() && helperTextListpicker.getValue().length > 0) {
        if (helperTextListpicker.getValue()[0].ReturnValue !== '-') {
          helperText = helperTextListpicker.getValue()[0].ReturnValue;
        }
      }
      if (customOverflowIconSwitch) {
        customOverflowIcon = customOverflowIconSwitch.getValue();
      }
      if (scenarioListpicker && scenarioListpicker.getValue() && scenarioListpicker.getValue().length > 0) {
        scenario = scenarioListpicker.getValue()[0].ReturnValue;
      }

      pageProxy.currentPage.context.clientData.HelperText = helperText;
      pageProxy.currentPage.context.clientData.CustomOverflowIcon = customOverflowIcon;
      pageProxy.currentPage.context.clientData.Scenario = scenario;
      pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavActionToFioriToolbarModalPage.action');
    }
  }
}