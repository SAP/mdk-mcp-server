export default function GetSelectedMenuItemIndexPath(context) {
  const index = context.getSelectedMenuItemIndexPath();

  var msg = "Selected item is at index Path: ";
  console.log(msg + index);
  alert(msg + index);
}
