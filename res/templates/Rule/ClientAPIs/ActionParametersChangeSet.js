export default function ActionParametersChangeSet(context) {
  const pageProxy = context.getPageProxy();

  pageProxy.setActionBinding({
    "Message": "Hello",
    "Title": "My Title"
  });

  return pageProxy.executeAction({
    "Name": "/MDKDevApp/Actions/ActionParametersChangeSet.action",
    "Parameters": {
      "SuccessMessage": "ChangeSet Action Success",
      "Message1": "{Message} 1",
      "Message2": "{Message} 2",
      "Service": "/MDKDevApp/Services/Amw.service",
      "Modal": true
    }
  });
}
