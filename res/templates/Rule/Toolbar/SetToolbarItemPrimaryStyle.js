export default function SetToolbarItemPrimaryStyle(controlProxy) {
  // Style the ToolBar items
  var page = controlProxy.evaluateTargetPath('#Page:ToolBarPrimaryButtonExample');
  page.getToolbar().then(function (toolbar) {
    var toolbarItems = toolbar.getToolbarItems();
    var currentValue = undefined;
    toolbarItems.forEach(function (element) {
      if (element.name == "NormalTextToolbarItem") {
        currentValue = element.itemType;
        if (currentValue.toLowerCase() !== 'button') {
          return element.setItemType('Button');
        } else {
          return element.setItemType('Normal');
        }        
      }
    });
  });
}