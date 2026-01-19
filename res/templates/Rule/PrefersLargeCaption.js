var dialog = require("@nativescript/core/ui/dialogs");
export default function PrefersLargeCaption(pageProxy) {
    let msg = "PrefersLargeCaption: " + pageProxy.getPrefersLargeCaption() + "\n Set PrefersLargeCaption = false";
    let options = {
      title: "PrefersLargeCaption",
      message: msg,
      okButtonText: "OK"
    };
  
    dialogs.alert(options).then(() => {
      pageProxy.setPrefersLargeCaption(false);
      alert("PrefersLargeCaption: " + pageProxy.getPrefersLargeCaption());
    });
}

