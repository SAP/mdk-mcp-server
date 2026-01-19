export default function SetLabelMaxLines(context) {
    let formCellContainerProxy = context.getParent();
    let labelFormCellProxy = formCellContainerProxy.getControl('LabelFormCell');
    let currentMaxLines = labelFormCellProxy.getMaxLines();
    let newMaxLines = currentMaxLines <= 5 ? 50 : 5
    labelFormCellProxy.setMaxLines(newMaxLines);
    let alertMessage = "set maxLines to: " + labelFormCellProxy.getMaxLines();
    alert(alertMessage);
  }