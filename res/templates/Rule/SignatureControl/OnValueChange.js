export default function OnValueChange(context) {
  context.clearValidation();
  return context.executeAction('/MDKDevApp/Actions/Toast/Success.action');
}
