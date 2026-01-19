
export default function GetObjectCellPurpleTextStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'ObjectCellPurpleText' : 'ObjectCellPurpleText2';
}
