export default function OfflineODataProps(context) {
  let provider = context.getODataProvider('/MDKDevApp/Services/Amw.service');
  let rq = provider.isRequestQueueEmpty();
  let pd = provider.hasPendingDownload();
  let pu = provider.hasPendingUpload();
  
  alert("isRequestQueueEmpty(): " + rq + "\n hasPendingDownload(): " + pd + "\n hasPendingUpload(): " + pu);
}