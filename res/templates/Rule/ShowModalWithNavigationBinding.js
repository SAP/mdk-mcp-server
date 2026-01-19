export default function ShowModalWithNavigationBinding(controlProxy) {
  // Pass a custom object as the navigation binding to the modal page.
  const navigationBinding = {
    SomeProperty: 'The SomeProperty value',
    SomeObject: {
      ObjectPropertyA: 'The ObjectPropertyA value',
      AnotherObject: {
        ObjectPropertyB: 'The ObjectPropertyB value',
      },
    },
  };
  const pageProxy = controlProxy.getPageProxy();
  pageProxy.setActionBinding(navigationBinding);
  pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavActionToModalPage.action');
}


