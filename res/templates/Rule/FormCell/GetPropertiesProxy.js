export default function GetPropertiesProxy(pageProxy) {
  var message = "";

  var formCellContainerProxy = pageProxy.getControl('FormCellContainer');
  var switchProxy = formCellContainerProxy.getControl('Switch');
  message += "\n\n From Proxy Switch: \n" + "Caption: " + switchProxy.getCaption();
  message += "\n IsEditable: " + switchProxy.getEditable();
  message += "\n HelperText: " + switchProxy.getHelperText();
  message += "\n Name: " + switchProxy.getName();
  message += "\n Type: " + switchProxy.getType();

  var buttonFormCellProxy = formCellContainerProxy.getControl('ButtonCell');

  message += "\n\n From Proxy  Button: \n" + "Title: " + buttonFormCellProxy.getTitle();
  message += "\n TextAlignment: " + buttonFormCellProxy.getTextAlignment();
  message += "\n ButtonType: " + buttonFormCellProxy.getButtonType();

  var  durationFormCellProxy = formCellContainerProxy.getControl("DurationFormCell");
  message += "\n MinuteInterval: " + durationFormCellProxy.getMinuteInterval();
  message += "\n Unit: " + durationFormCellProxy.getUnit();

  var  datePickerFormCellProxy = formCellContainerProxy.getControl("DatePickerFormCell");
  message += "\n Mode: " + datePickerFormCellProxy.getMode();

  var  simplePropertyFormCellProxy = formCellContainerProxy.getControl("SimplePropertyFormCellCtrl");
  message += "\n\n From Proxy  SimplePropertyFormCell: \n" + "AlternateInput: " + simplePropertyFormCellProxy.getTAlternateInput();
  message += "\n KeyboardType: " + simplePropertyFormCellProxy.getKeyboardType();
  message += "\n PlaceHolder: " + simplePropertyFormCellProxy.getPlaceHolder();

  var  listPickerFormCell = formCellContainerProxy.getControl("ListPicker");
  message += "\n\n  ListPickerFormCell: \n" + "AllowMultipleSelection: " + listPickerFormCell.getAllowMultipleSelection();
  
  message += "\n IsSearchCancelledAfterSelection: " + listPickerFormCell.getIsSearchCancelledAfterSelection();
  message += "\n Search: " + JSON.stringify(listPickerFormCell.getSearch());
  message += "\n AllowEmptySelection: " + listPickerFormCell.getAllowEmptySelection();
  message += "\n Search: " + JSON.stringify(listPickerFormCell.getSearch());
  message += "\n AllowEmptySelection: " + listPickerFormCell.getIsPickerDismissedOnSelection();
  message += "\n DataPaging: " + JSON.stringify(listPickerFormCell.getDataPaging());

  var noteFormCell =  formCellContainerProxy.getControl("NoteFormCell");
  message += "\n MaxNumberOfLines: " + noteFormCell.getMaxNumberOfLines();
  message += "\n MinNumberOfLines: " + noteFormCell.getMinNumberOfLines();
  message += "\n MinNumberOfLines: " + noteFormCell.getPlaceHolder();

  alert(message);
}
