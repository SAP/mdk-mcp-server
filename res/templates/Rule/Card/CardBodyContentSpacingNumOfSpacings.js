export default function CardBodyContentSpacingNumOfSpacings(clientAPI) {
  let segmentValue = clientAPI.getPageProxy().evaluateTargetPath("#Page:CardTestControlPage/#Control:BodyContentSpaceNumberOfSpacingsSegmented/#SelectedValue");
  if (segmentValue && segmentValue !== '') {
    return parseInt(segmentValue);
  }
  return 1;
}
