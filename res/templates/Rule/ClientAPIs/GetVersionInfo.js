export default function GetVersionInfo(context) {
  const info = context.getVersionInfo();

  var msg = "";
  var item = "";
  for (const key of Object.keys(info)) {
      item =  key + " = " + info[key];
      msg += item;
      msg += "\r\n";
  }
  alert(msg);
}