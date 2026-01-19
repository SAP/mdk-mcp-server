export default function SetToolbarItemStyle(controlProxy) {
  // Style the ToolBar items
  var page = controlProxy.evaluateTargetPath('#Page:ToolBarStylingExample');
  const control = controlProxy.evaluateTargetPathForAPI('#Page:ToolBarStylingExample/#Control:SwitchStyle');
  page.getToolbar().then(function (toolbar) {
    var toolbarItems = toolbar.getToolbarItems();
    var currentValue = undefined;
    var newStyle;
    toolbarItems.forEach(function (element) {
      if (element.name == "RuleStylableToolbarItem") {
        currentValue = control.getValue();
        if (currentValue === false) {
          newStyle = 'toolbar-style-1';
        } else {
          newStyle = 'toolbar-style-2';
        }
        return element.setStyle(newStyle);
      }
    });
  });
}