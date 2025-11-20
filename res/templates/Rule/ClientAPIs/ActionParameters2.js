export default function ActionParameters2(context) {
  const pageProxy = context.getPageProxy();

  pageProxy.setActionBinding({
    "Message": "Hello",
    "Title": "My Title"
  });

  return pageProxy.executeAction({
    "Name": "/MDKDevApp/Actions/Messages/MessageActionParameters2.action",
    "Properties": {
      "OnSuccess": {
        "Name": "/MDKDevApp/Actions/Messages/MessageActionParameters2.action",
        "Properties": {
          "OnSuccess": {
            "Name": "/MDKDevApp/Actions/Messages/MessageActionParameters2.action",
            "Parameters": {
              "Message": "My Message 3 is {Message}",
              "Title": "-- {Title} 3 --"
            }
          }
        },
        "Parameters": {
          "Title": "-- {Title} 2 - {#ActionParameters/InnerTitle} --"
        }
      }
    },
    "Parameters": {
      "Message": "My Message is {Message}",
      "Title": "-- {Title} --",
      "InnerTitle": "Inner"
    }
  });
}
