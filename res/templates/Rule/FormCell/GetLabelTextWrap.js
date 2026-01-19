export default function GetLabelTextWrap(context) {
    let formCellContainerProxy = context.getParent();
    let labelFormCellProxy = formCellContainerProxy.getControl('LabelFormCell');
    let result = "textWrap: " + labelFormCellProxy.getTextWrap();
    alert(result);
  }