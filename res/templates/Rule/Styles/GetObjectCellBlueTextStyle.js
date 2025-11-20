
export default function GetObjectCellBlueTextStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'ObjectCellBlueText' : 'ObjectCellBlueText2';
}
