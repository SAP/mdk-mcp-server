export default function SetFocusFalse(controlProxy) {
  const containerProxy = controlProxy.getPageProxy().getControl('SectionedTable');
  if (!containerProxy.isContainer()) {
    return;
  }

  const listPicker = containerProxy.getControl('ListPicker1');
  const listPickerValue = listPicker.getValue()[0].ReturnValue;
  console.log("listPickerValue: " + listPickerValue);

  let control = null;
  if (listPickerValue === "Title") {
    control = containerProxy.getControl('TitleFormCell');
  } else if (listPickerValue === "Invisible Title") {
    control = containerProxy.getControl('TitleFormCell2');
  } else if (listPickerValue === "Simple Property") {
    control = containerProxy.getControl('SimplePropertyFormCell');
  } else if (listPickerValue === "Invisible Simple Property") {
    control = containerProxy.getControl('SimplePropertyFormCell2');
  } else if (listPickerValue === "Non-Editable Simple Property") {
    control = containerProxy.getControl('SimplePropertyFormCell3');
  } else if (listPickerValue === "Note") {
    control = containerProxy.getControl('NoteFormCell');
  } else if (listPickerValue === "Invisible Note") {
    control = containerProxy.getControl('NoteFormCell2');
  } else if (listPickerValue === "DatePicker") {
    control = containerProxy.getControl('DatePicker');
  } else if (listPickerValue === "Password") {
    control = containerProxy.getControl('SimplePropertyFormCellPwd');
  } else if (listPickerValue === "NumberPassword") {
    control = containerProxy.getControl('SimplePropertyFormCellPwd2');
  } else if (listPickerValue === "Simple Property Middle") {
    control = containerProxy.getControl('SimplePropertyFormCellMiddle');
  } else if (listPickerValue === "Simple Property End") {
    control = containerProxy.getControl('SimplePropertyFormCellEnd');
  }

  if (control) {
    control.setFocus('AlwaysHide');
  }
}
