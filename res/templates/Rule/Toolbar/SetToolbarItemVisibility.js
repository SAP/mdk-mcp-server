export default function SetToolbarItemVisibility(controlProxy) {
  // Style the ToolBar items
  var page = controlProxy.evaluateTargetPath('#Page:DynamicToolbarItem');
  page.getToolbar().then(function (toolbar) {
    var toolbarItems = toolbar.getToolbarItems();
    var newValue;

    // visible: The view is visible.
    // hidden: The view is not visible but will take place in the layout.
    // collapse: The view is not visible and won't take place in the layout.
    toolbarItems.forEach(function (element) {
      if (element.name == 'DynamicItemVisibility') {
        newValue = 'visible';
        if (element.visibility === 'visible') {
          newValue = 'hidden';
        } else if (element.visibility === 'hidden') {
          newValue = 'collapse';
        }
        return element.setVisibility(newValue);
      }
    });
  });
}