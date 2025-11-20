export default function PopulateOnLoaded(clientAPI) {
  let formcellContainer = clientAPI.getControls()[0];
  let clientData = clientAPI.evaluateTargetPath('#Page:FormCellTestPage1').context.clientData;
  if (clientData && clientData.filterPageResults) {
    let previousResults = clientData.filterPageResults;
    let previousResult = previousResults[0];
    let formcellControl = formcellContainer.getControl(previousResult.controlName);
    formcellControl.setValue(previousResult.value);
  }
}