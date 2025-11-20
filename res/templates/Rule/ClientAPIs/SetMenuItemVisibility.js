export default function SetMenuItemVisibility(context) {
    var flag = true;
    var menuItems = context.getMenuItemsAtSection(3);
    menuItems[2].setVisibility(!flag);
    alert("Menu Item Visibility Changed");
  }