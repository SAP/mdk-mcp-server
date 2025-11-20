
export default function GetObjectCellGreenTextStyleAlt(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'ObjectCellGreenText' : 'ObjectCellGreenText2';
}
