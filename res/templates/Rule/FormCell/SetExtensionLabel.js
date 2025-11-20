export default function SetExtensionLabel(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const controlProxy = pageProxy.evaluateTargetPathForAPI("#Control:ExtensionFormCell1");
  controlProxy.getExtension().setLabel("The value is set through ClientAPI!");
}