export default function GetExtensionProxy(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const controlProxy = pageProxy.getControl('FormCellContainer');
  const formCellProxy = controlProxy.getControl('ExtensionFormCell1');
  alert("This is " + formCellProxy.constructor.name);
}