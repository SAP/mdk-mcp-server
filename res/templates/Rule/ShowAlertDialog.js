var dialogs = require("@nativescript/core/ui/dialogs");

// This rule is used to show some data from the attachment
// formcell change events.
export default function ShowAlertDialog(clientAPI) {
    function getUrlString(item, useCount) {
        return useCount ? item.objectForKey("urlString") : item["urlString"];
    }

    const data = clientAPI._clientAPIProps().newControlValue;

    const useCount = typeof(data.count) !== 'undefined';
    const length = useCount ? data.count : data.length;

    let message;
    if (length > 0) {
        message = "ATTACHMENTS: \n";
    } else {
        message = "NO ATTACHMENTS!";
    }

    for (let i = 0; i < length; i++) {
        message = message + "\n" + getUrlString(data[i], useCount);
    }

    dialogs.alert(message).then(function () {
        console.log("Dialog closed!");
    });
}
