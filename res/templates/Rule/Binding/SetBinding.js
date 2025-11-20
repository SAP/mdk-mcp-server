export default function SetBinding(clientAPI) {
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
  const pageProxy = clientAPI.getPageProxy();
  pageProxy.setActionBinding(data);
  return pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToBinding.action');
}