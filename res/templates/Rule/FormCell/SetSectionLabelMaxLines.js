export default function SetSectionLabelMaxLines(context) {
  let switchProxy = context;
  let labelFormCellProxy = context.getParent().getControl('LabelFormCell2');
  let maxLines = switchProxy.getValue() ? 2 : 50;
  labelFormCellProxy.setMaxLines(maxLines);
  labelFormCellProxy.redraw();
}