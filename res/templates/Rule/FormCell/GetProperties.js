export default function GetProperties(pageProxy) {
  var message = "";

  var switchCtrl = pageProxy.evaluateTargetPathForAPI("#Control:Switch");
  message += "\n\n Switch: \n" + "Caption: " + switchCtrl.getCaption();
  message += "\n IsEditable: " + switchCtrl.getEditable();
  message += "\n HelperText: " + switchCtrl.getHelperText();
  message += "\n Name: " + switchCtrl.getName();
  message += "\n Type: " + switchCtrl.getType();

  var  buttonFormCell = pageProxy.evaluateTargetPathForAPI("#Control:ButtonCell");
  message += "\n\n  Button: \n" + "Title: " + buttonFormCell.getTitle();
  message += "\n TextAlignment: " + buttonFormCell.getTextAlignment();
  message += "\n ButtonType: " + buttonFormCell.getButtonType();

  var  durationFormCell = pageProxy.evaluateTargetPathForAPI("#Control:DurationFormCell");
  message += "\n\n  DurationPicker FormCell: \n\n MinuteInterval: " + durationFormCell.getMinuteInterval();
  message += "\n Unit: " + durationFormCell.getUnit();

  var  datePickerFormCell = pageProxy.evaluateTargetPathForAPI("#Control:DatePickerFormCell");
  message += "\n\n  DatePickerFormCell FormCell: \n Mode: " + datePickerFormCell.getMode();

  var  simplePropertyFormCell = pageProxy.evaluateTargetPathForAPI("#Control:SimplePropertyFormCellCtrl");
  message += "\n\n  SimplePropertyFormCell: \n" + "AlternateInput: " + simplePropertyFormCell.getAlternateInput();
  message += "\n KeyboardType: " + simplePropertyFormCell.getKeyboardType();
  message += "\n PlaceHolder: " + simplePropertyFormCell.getPlaceHolder();
  
  var  listPickerFormCell = pageProxy.evaluateTargetPathForAPI("#Control:ListPicker");
  message += "\n\n  ListPickerFormCell: \n" + "AllowMultipleSelection: " + listPickerFormCell.getAllowMultipleSelection();
  message += "\n IsSearchCancelledAfterSelection: " + listPickerFormCell.getIsSearchCancelledAfterSelection();
  message += "\n Search: " + JSON.stringify(listPickerFormCell.getSearch());
  message += "\n AllowEmptySelection: " + listPickerFormCell.getAllowEmptySelection();
  message += "\n Search: " + JSON.stringify(listPickerFormCell.getSearch());
  message += "\n AllowEmptySelection: " + listPickerFormCell.getIsPickerDismissedOnSelection();
  message += "\n DataPaging: " + JSON.stringify(listPickerFormCell.getDataPaging());

  var  listPickerFormCell1 = pageProxy.evaluateTargetPathForAPI("#Control:ListPicker1");
  message += "\n\n  ListPickerFormCell1:  \n PickerItems: " + JSON.stringify(listPickerFormCell1.getPickerItems());

  var noteFormCell = pageProxy.evaluateTargetPathForAPI("#Control:NoteFormCell");
  message += "\n MaxNumberOfLines: " + noteFormCell.getMaxNumberOfLines();
  message += "\n MinNumberOfLines: " + noteFormCell.getMinNumberOfLines();
  message += "\n PlaceHolder: " + noteFormCell.getPlaceHolder();

  var titleFormCell = pageProxy.evaluateTargetPathForAPI("#Control:TitleCell");
  message += "\n\n TitleCell \n PlaceHolder: " + titleFormCell.getPlaceHolder();

  var segmentedControl = pageProxy.evaluateTargetPathForAPI("#Control:SegmentedControl");
  message += "\n\n SegmentedControl \n ApportionsSegmentWidthsByContent: " + segmentedControl.getApportionsSegmentWidthsByContent(false);
  message += "\n Segments: " + JSON.stringify(segmentedControl.getSegments());
  message += "\n\n SegmentedControl \n Segments: " + JSON.stringify(segmentedControl.getSegments());
  
  
  var  attachmenFormCell = pageProxy.evaluateTargetPathForAPI("#Control:AttachmentFormCell");
  message += "\n\n AttachmentFormCell: \n" + "AllowedFileTypes: " + attachmenFormCell.getAllowedFileTypes().toString();
  message += "\n AttachmentTitle: " + attachmenFormCell.getAttachmentTitle();
  message += "\n AttachmentAddTitle: " + attachmenFormCell.getAttachmentAddTitle();
  message += "\n AttachmentCancelTitle: " + attachmenFormCell.getAttachmentCancelTitle();
  message += "\n getAttachmentActionType: " + attachmenFormCell.getAttachmentActionType().toString();
  
  var signatureCellFormCell = pageProxy.evaluateTargetPathForAPI("#Control:SignatureCell");
  message += "\n\n SegmentedControl \n CapturedStatusText: " + signatureCellFormCell.getCapturedStatusText();
  message += "\n InitialStatus: " + signatureCellFormCell.getInitialStatusText();
  message += "\n Underline: " + signatureCellFormCell.getShowUnderline();
  message += "\n ShowTimestampInImage: " + signatureCellFormCell.getShowTimestampInImage();
  message += "\n ShowXMark: " + signatureCellFormCell.getShowXMark();
  message += "\n TimestampFormatter: " + signatureCellFormCell.getTimestampFormatter();
  message += "\n WatermarkText: " + signatureCellFormCell.getWatermarkText();
  message += "\n WatermarkTextMaxLines: " + signatureCellFormCell.getWatermarkTextMaxLines();

  var inLinesignatureCellFormCell = pageProxy.evaluateTargetPathForAPI("#Control:InlineSignatureCell");
  message += "\n\n InLinesignatureCellFormCell: \n"
  message += "\n Underline: " + inLinesignatureCellFormCell.getShowUnderline();
  message += "\n ShowTimestampInImage: " + inLinesignatureCellFormCell.getShowTimestampInImage();
  message += "\n ShowXMark: " + inLinesignatureCellFormCell.getShowXMark();
  message += "\n TimestampFormatter: " + inLinesignatureCellFormCell.getTimestampFormatter();
  message += "\n WatermarkText: " + inLinesignatureCellFormCell.getWatermarkText();
  message += "\n WatermarkTextMaxLines: " + inLinesignatureCellFormCell.getWatermarkTextMaxLines();
  
  alert(message);
}

