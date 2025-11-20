export default function CardBodyContentTextNumOfLines(clientAPI) {
  let segmentValue = clientAPI.getPageProxy().evaluateTargetPath("#Page:CardTestControlPage/#Control:BodyContentTextNumberOfLinesSegmented/#SelectedValue");
  if (segmentValue && segmentValue !== '') {
    return parseInt(segmentValue);
  }
  return 1;
}
