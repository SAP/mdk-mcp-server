
export default function GetDialogOkButtonStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'ok-button-style' : 'ok-button-style2';
}
