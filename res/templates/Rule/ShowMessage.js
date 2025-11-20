var dialogs = require("@nativescript/core/ui/dialogs");

export default function ShowMessage() {
  dialogs.confirm({
    title: "Your title",
    message: "Your message",
    okButtonText: "Your button text",
    cancelButtonText: "Cancel text",
    neutralButtonText: "Neutral text"
  }).then(function (result) {
    // result argument is boolean
    console.log("Dialog result: " + result);
  });
}