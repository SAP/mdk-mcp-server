export default function CellVisibleReset(context) {
  let controlNames = [
    '#Page:-Current/#Control:HiddenSimpleProperty',
    '#Page:-Current/#Control:TitleFormCellVisiblity',
    '#Page:-Current/#Control:InlineSignatureCellVisibility',
    '#Page:-Current/#Control:SignatureCellVisibility'
  ];

  for (let controlName of controlNames) {
    let controlProxy = context.evaluateTargetPathForAPI(controlName);
    controlProxy.reset();
  }
}
