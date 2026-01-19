
export default function GetObjectCellYellowTextStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'ObjectCellYellowText' : 'ObjectCellYellowText2';
}
