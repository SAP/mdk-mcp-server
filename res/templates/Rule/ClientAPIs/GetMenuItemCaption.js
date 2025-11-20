export default function GetMenuItemCaption(context) {
    var menuItems = context.menuItems[2];
    var caption = menuItems[1].getTitle();
    alert("Menu Item at 1th Index = " + caption);
  }