export default function OnBackButtonPressed(clientAPI) {
  let dialogs = clientAPI.nativescript.uiDialogsModule;
  return dialogs.confirm("Back now?").then((result) => {
    console.log("Back now? " + result);
    return result;
  });
}
