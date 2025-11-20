export default function ClearValidationOnValueChange(controlProxy) {
  const noteValue = controlProxy.getValue();

  if (noteValue !== undefined && noteValue !== '') {
    controlProxy.clearValidationOnValueChange();
  }
}