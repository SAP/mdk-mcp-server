export default function SetFocus(clientAPI) {
  let formcell = clientAPI.getControl('SimplePropertyFormCell');
  if (formcell) {
    formcell.setFocus();
  }
}