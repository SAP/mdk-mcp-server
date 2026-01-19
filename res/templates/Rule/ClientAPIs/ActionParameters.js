export default function ActionParameters(context) {
  const pageProxy = context.getPageProxy();

  pageProxy.setActionBinding({
    "Message": "Hello",
    "Title": "My Title"
  });

  return pageProxy.executeAction({
    "Name": "/MDKDevApp/Actions/Messages/MessageActionParameters2.action",
    "Parameters": {
      "Message": "My Message is {Message}",
      "Title": "-- {Title} --"
    }
  });
}
