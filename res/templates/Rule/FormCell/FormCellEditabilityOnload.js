export default function FormCellEditabilityOnload(controlProxy) {
  const containerProxy = controlProxy.getPageProxy().getControl('FormCellContainer');
  if (!containerProxy.isContainer()) {
    return;
  }
  
  const InvisibleControl = containerProxy.getControl('InvisibleControl');
  InvisibleControl.visible = false;

  const InvisibleControl2 = containerProxy.getControl('InvisibleControl2');
  InvisibleControl2.visible = false;
}
