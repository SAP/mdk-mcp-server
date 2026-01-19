export default function SetApplicationTargetPath(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  return pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToApplicationTargetPath.action');
}