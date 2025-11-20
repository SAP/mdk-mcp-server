
export default function GetObjectCellOrangeTextStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'ObjectCellBrownText' : 'ObjectCellBrownText2';
}
