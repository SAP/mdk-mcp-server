export default function OverrideMessages(context) {
  const pageProxy = context.getPageProxy();

  pageProxy.setActionBinding({
    'message': "Hello",
    'message2': "Hello2",
    'message3': "Hello3"
  });
  
  return pageProxy.executeAction({
    "Name": "/MDKDevApp/Actions/Messages/Message.action",
    "Properties": {
      "Message": "My Message is {message}",
      "Title": "Title 1",
      "OnSuccess": {
        "Name": "/MDKDevApp/Actions/Messages/Message.action",
        "Properties": {
          "Message": "My Message is {message2}",
          "OnSuccess": {
            "Name": "/MDKDevApp/Actions/Messages/Message.action",
            "Properties": {
              "Message": "My Message is {message3}",
              "Title": "Title 3"
            }
          }
        }
      }
    }
  });
}