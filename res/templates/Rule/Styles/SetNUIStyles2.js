import SetNUIStyles2Common from './SetNUIStyles2Common';
export default async function SetNUIStyles2(clientAPI) {
  const selection = clientAPI.getValue()[0].ReturnValue || '';
  const switchCell = clientAPI.evaluateTargetPath('#Page:-Current/#Control:MasterSwitchCell');
  await switchCell.setValue(!switchCell.getValue(), false);
  SetNUIStyles2Common(clientAPI, selection.toLowerCase());
}
