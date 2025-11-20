export default function SetLabelTextWrap(context) {
    let formCellContainerProxy = context.getParent();
    let labelFormCellProxy = formCellContainerProxy.getControl('LabelFormCell');
    let currentTextWrap = labelFormCellProxy.getTextWrap();
    let newTextWrap = !currentTextWrap
    labelFormCellProxy.setTextWrap(newTextWrap);
    let alertMessage = "set textWrap to: " + labelFormCellProxy.getTextWrap()
    alert(alertMessage);
  }