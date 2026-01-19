export default function ShowPageWithNavigationBinding(controlProxy) {
  // Pass a custom object as the navigation binding to the next page.
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
  return pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToCustomBinding.action');
}
