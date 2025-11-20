export default function GetMenuItemsAtSection(context) {
    var menuItems = context.getMenuItemsAtSection(0);
    alert("menu items at section 0 are " + menuItems.length);
  }