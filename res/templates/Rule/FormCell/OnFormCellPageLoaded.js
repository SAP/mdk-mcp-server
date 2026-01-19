export default function OnFormCellPageLoaded(pageProxy) {
  // Set button styles
  const formCellContainerProxy = pageProxy.getControl('FormCellContainer');
  const button1 = formCellContainerProxy.getControl('Button1');
  const button2 = formCellContainerProxy.getControl('Button2');
  const button3 = formCellContainerProxy.getControl('Button3');
  button1.setStyle('FormCellBackgroundStandard', 'Background');
  button1.setStyle('FormCellButtonStyleDefault', 'Value');
  button2.setStyle('FormCellBackgroundCritical', 'Background');
  button2.setStyle('FormCellButtonStyle2', 'Value');
  button3.setStyle('FormCellBackgroundCriticalTitle', 'Background');
  button3.setStyle('FormCellButtonStyle3', 'Value');
  // Redraw so that the styles are picked up
  formCellContainerProxy.redraw();
}
