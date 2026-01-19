export default function GetLabelMaxLines(context) {
    let formCellContainerProxy = context.getParent();
    let labelFormCellProxy = formCellContainerProxy.getControl('LabelFormCell');
    let result = "maxLines: " + labelFormCellProxy.getMaxLines();
    alert(result);
  }