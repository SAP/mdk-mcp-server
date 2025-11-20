export default function SetSectionLabelTextWrap(context) {
  let switchProxy = context;
  let labelFormCellProxy = context.getParent().getControl('LabelFormCell2');
  labelFormCellProxy.setTextWrap(switchProxy.getValue());
  labelFormCellProxy.redraw();
}