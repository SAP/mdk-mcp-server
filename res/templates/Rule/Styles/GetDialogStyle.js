
export default function GetDialogStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'dialog-style' : 'dialog-style2';
}
