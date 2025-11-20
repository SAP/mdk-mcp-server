export default function SetDefaultValue(clientAPI) {
	// Pass a custom object as the navigation binding to the next page.
  const data = {
    SomeProperty: 'SomeProperty value',
    SomePropertyB: 'SomeProperty, value',
    NullProperty: null,
    EmptyString: "",
    SomeObject: {
      ObjectPropertyA: 'ObjectPropertyA value',
      AnotherObject: {
        ObjectPropertyB: 'ObjectPropertyB value',
      },
      NullProperty: null,
      EmptyString: "",
    },
    Message: "This is message",
    MyArray: [
      {Title: "Title 0"},
      {Title: "Title 1"},
      {Title: "Title 2"},
      {Title: "Title 3"},
      {Title: "Title 4"}
    ],
    MyObject: {
      "10": {
        MyProp: "Property 10"
      }
    }
  };
  const pageProxy = clientAPI.getPageProxy();
  pageProxy.setActionBinding(data);

  pageProxy.getClientData()['TargetPath'] = data;

  return pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToDefaultValue.action');
}