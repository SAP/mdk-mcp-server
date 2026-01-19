export default function SetMenuItemCaption(context) {
    var newCaption = "New Caption";
    var menuItems = context.getMenuItemsAtSection(3);
    var caption = menuItems[2].getTitle();
    alert("Menu Item at 3rd Index = " + caption);
    alert("New Caption is : " + newCaption);
    menuItems[2].setTitle(newCaption);
  }