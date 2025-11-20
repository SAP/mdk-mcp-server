export default function DocumentActionBinding(pageProxy) {
  let actionBinding = pageProxy.getActionBinding();

  if (!actionBinding) {
    actionBinding = pageProxy.getPendingDownload('BDSDocumentMediaListPage');
  }

  return actionBinding;
}