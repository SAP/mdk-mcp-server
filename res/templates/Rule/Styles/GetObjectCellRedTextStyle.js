
export default function GetObjectCellRedTextStyle(controlProxy) {
  let cd = controlProxy.getPageProxy().getClientData();
  let styleFlag = !!cd.styleFlag;
  return styleFlag ? 'ObjectCellRedText' : 'ObjectCellRedText2';
}
