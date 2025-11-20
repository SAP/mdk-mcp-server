
export default function GetDialogCancelButtonStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'cancel-button-style' : 'cancel-button-style2';
}
