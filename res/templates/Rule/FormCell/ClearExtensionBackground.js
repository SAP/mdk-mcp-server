export default function ClearExtensionBackground(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const controlProxy = pageProxy.evaluateTargetPathForAPI("#Control:ExtensionFormCell1");
  controlProxy.getExtension().clearBackgroundColor();
}