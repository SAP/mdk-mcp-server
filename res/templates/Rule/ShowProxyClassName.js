var dialogs = require("@nativescript/core/ui/dialogs");

export default function ShowProxyClassName(context) {
  var text = 'The proxy class name is ';
  if (context && context.constructor && context.constructor.name) {
    text = text + context.constructor.name;
  }
  dialogs.confirm({
    title: 'Proxy Class',
    message: text,
    okButtonText: "OK"
  });
}