export default function OverrideMessage(context) {
  const pageProxy = context.getPageProxy();

  pageProxy.setActionBinding({
    'message': "Hello"
  });

  return pageProxy.executeAction({
    "Name": "/MDKDevApp/Actions/Messages/Message.action",
    "Properties": {
      "Message": "My Message is {message}",
      "Title": "Title 1"
    }
  });
}