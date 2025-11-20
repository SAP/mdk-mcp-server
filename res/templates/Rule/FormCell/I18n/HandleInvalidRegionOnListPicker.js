export default function HandleInvalidRegionOnListPicker(controlClientAPI) {
  var listPickerCell = controlClientAPI.evaluateTargetPathForAPI('#Page:I18nSettings/#Control:RegionListPicker');
  var currentAppRegion = controlClientAPI.getRegion();
  listPickerCell.setValue(currentAppRegion);
  controlClientAPI.executeAction('/MDKDevApp/Actions/Messages/SetRegionFailureMessage.action');
}