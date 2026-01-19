export default function OverrideUpdateEntity(context) {
  let readLink = "MyWorkOrderHeaders('4000019')";
  let description = "Override Description " + Math.floor(Math.random() * 100);

  return context.executeAction({
    "Name": "/MDKDevApp/Actions/OData/UpdateServiceViaRule.action",
    "Properties": {
      "Target": {
        "ReadLink": readLink
      },  
      "Properties": {
        "OrderDescription": description
      },
    }
  });
}