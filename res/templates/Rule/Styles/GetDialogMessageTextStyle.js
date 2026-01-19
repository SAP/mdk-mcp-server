
export default function GetDialogMessageTextStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'dialog-message-style' : 'dialog-message-style2';
}
