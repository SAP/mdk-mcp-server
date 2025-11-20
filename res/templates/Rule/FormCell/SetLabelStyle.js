export default function SetLabelStyle(context) {
    let formCellContainerProxy = context.getParent();
    let labelFormCellProxy = formCellContainerProxy.getControl('LabelFormCell');
    labelFormCellProxy.setStyle('MDKLabelFormCell2');
  }