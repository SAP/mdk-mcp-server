export default function AmendToolbarVisibility(context) {
  var toolbar = context.getToolbar();
  var getToolbarVisible = toolbar.getVisible();
  if (getToolbarVisible === true) {
    toolbar.setVisible(false);
  } else if (getToolbarVisible === false) {
    toolbar.setVisible(true);
  }
  context.executeAction('/MDKDevApp/Actions/Messages/ToolbarValueChanged.action');
}