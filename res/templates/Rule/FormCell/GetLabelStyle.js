export default function GetLabelStyle(context) {
  let formCellContainerProxy = context.getParent();
  let labelFormCellProxy = formCellContainerProxy.getControl('LabelFormCell');
  let result = "style class: " + labelFormCellProxy.getStyle();
  alert(result);
}