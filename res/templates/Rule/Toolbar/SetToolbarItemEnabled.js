export default function SetToolbarItemEnabled(controlProxy) {
  // Style the ToolBar items
  var page = controlProxy.evaluateTargetPath('#Page:DynamicToolbarItem');
  page.getToolbar().then(function (toolbar) {
    var toolbarItems = toolbar.getToolbarItems();
    var newValue;
    toolbarItems.forEach(function (element) {
      if (element.name == 'DynamicItemEnabled') {
        newValue = true;
        if (element.enabled === true) {
          newValue = false;
        }
        return element.setEnabled(newValue);
      }
    });
  });
}