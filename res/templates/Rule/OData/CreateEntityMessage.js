export default function CreateEntityMessage(clientAPI) {
  let actionResult = clientAPI.getActionResult('CreateWorkOrder');
  if (actionResult) {
    let entity = actionResult.success;
    return 'Entity created with description \"' + entity.OrderDescription + '\"';
  }

  return 'Entity successfully created';
}
