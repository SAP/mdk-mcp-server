export default function GetAppearanceMode(context) {
  let mode = context.getAppearanceMode();
  context.getClientData().Message = mode;
  return context.executeAction('/MDKDevApp/Actions/Messages/AlertMessage.action');
}
