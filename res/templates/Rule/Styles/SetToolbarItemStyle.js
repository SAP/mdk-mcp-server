export default function SetToolbarItemStyle(controlProxy) {
  // Style the ToolBar items
  var page = controlProxy.evaluateTargetPath('#Page:StyleExamples');
  page.getToolbar().then(function (toolbar) {
    var toolbarItems = toolbar.getToolbarItems();
    toolbarItems.forEach(function (element) {
      if (element.clickable) {
        element.setStyle('toolbar-button');
      } else {
        element.setStyle('toolbar-label');
      }
    });
  });
}
