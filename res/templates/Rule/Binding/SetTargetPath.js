export default function SetTargetPath(clientAPI) {
	// Pass a custom object as the navigation binding to the next page.
  const data = {
    SomeProperty: 'SomeProperty value',
    SomeObject: {
      ObjectPropertyA: 'ObjectPropertyA value',
      AnotherObject: {
        ObjectPropertyB: 'ObjectPropertyB value',
      },
    },
  };
  const Message = "This is message";
  const pageProxy = clientAPI.getPageProxy();
  pageProxy.getClientData()['TargetPath'] = data;
  pageProxy.getClientData().Message = Message;
  return pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToTargetPath.action');
}