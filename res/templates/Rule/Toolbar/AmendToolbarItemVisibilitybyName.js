export default function AmendToolbarItemVisibilitybyName(context) {
  var toolbar = context.getToolbar();
  var getToolbarItem = toolbar.getToolbarItem('LogOut');
  var getToolbarVisible = getToolbarItem.getVisible();
  if (getToolbarVisible === true) {
    getToolbarItem.setVisible(false);
  } else if (getToolbarVisible === false) {
    getToolbarItem.setVisible(true);
  }
  context.executeAction('/MDKDevApp/Actions/Messages/ToolbarItemValueChanged.action');
}