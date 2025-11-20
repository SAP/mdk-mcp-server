
export default function GetDialogTitleStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'dialog-title-style' : 'dialog-title-style2';
}
