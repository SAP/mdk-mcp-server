export default function SetSectionLabelStyle(context) {
  let switchProxy = context;
  let labelFormCellProxy = context.getParent().getControl('LabelFormCell2');
  let style = switchProxy.getValue() ? 'MDKLabelFormCell2' : 'MDKLabelFormCell'
  labelFormCellProxy.setStyle(style);
  labelFormCellProxy.redraw();
}