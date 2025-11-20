export default function GetSelectedMenuItemName(context) {
    const itemName = context.getSelectedMenuItemName();
  
    var msg = "Selected item name is : ";
    console.log(msg + itemName);
    alert(msg + itemName);
  }