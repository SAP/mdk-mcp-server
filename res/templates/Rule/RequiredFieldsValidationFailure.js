export default function RequiredFieldsValidationFailure(clientAPI) {
  // When a requiredFieldsAction is specified and run on a page, 
  // any requiredField(s) missing value will be added to an array and added to
  // the page clientAPI and the requiredFieldsAction fails.
  // The specified OnFailure action/rule as this one can then access the array of controls like so.
  let missingRequiredFields = clientAPI.getMissingRequiredControls();
  let missingFieldsList = '';
  for (let control of missingRequiredFields) {
    missingFieldsList += control.definition().getName() + ' ';
  }
  console.log("Fields Missing values (logged from failure rule): " + missingFieldsList);
  return missingFieldsList;
}
