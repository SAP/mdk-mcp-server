import ApplyStylesCommon from './ApplyStylesCommon';
export default async function ApplyStyles(clientAPI) {
  const selection = clientAPI.getValue ? (clientAPI.getValue()[0].ReturnValue || '') : '';
  const switchCell = clientAPI.evaluateTargetPath('#Page:-Current/#Control:MasterSwitchCell');
  await switchCell.setValue(!switchCell.getValue(), false);
  ApplyStylesCommon(clientAPI, selection.toLowerCase());
}
