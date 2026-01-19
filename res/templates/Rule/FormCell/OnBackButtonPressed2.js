export default function OnBackButtonPressed2(clientAPI) {
  let dialogs = clientAPI.nativescript.uiDialogsModule;
  return dialogs.confirm("Back now?").then((result) => {
    console.log("Back now? " + result);
    if (result === false) {
      return result;
    }
  });
}
