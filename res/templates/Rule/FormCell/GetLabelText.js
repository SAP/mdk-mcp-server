export default function GetLabelText(context) {
  let formCellContainerProxy = context.getParent();
  let labelFormCellProxy = formCellContainerProxy.getControl('LabelFormCell');
  let result = "text: " + labelFormCellProxy.getText();
  alert(result);
}