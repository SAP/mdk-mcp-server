export default function SectFormCellSetProperties(pageProxy) {

  var switchControl = pageProxy.evaluateTargetPathForAPI("#Control:Switch");
  switchControl.setCaption("New Switch Caption");
  switchControl.setHelperText("New switch helper text");
  switchControl.setEnable(false);
  
  var buttonFormCell = pageProxy.evaluateTargetPathForAPI("#Control:ButtonCell");
  buttonFormCell.setTitle("Button New Title");
  buttonFormCell.setTextAlignment("right");
  buttonFormCell.setButtonType('Normal');

  var simplePropertyFormCell = pageProxy.evaluateTargetPathForAPI("#Control:SimplePropertyFormCellCtrl");
  simplePropertyFormCell.setAlternateInput("Barcode");
  simplePropertyFormCell.setKeyboardType("Number");
  simplePropertyFormCell.setPlaceHolder('New Place Holder');

  var  listPickerFormCell = pageProxy.evaluateTargetPathForAPI("#Control:ListPicker");
  listPickerFormCell.setAllowMultipleSelection(true);
  var searchObj =  {
    "Enabled": true,
    "Placeholder": "New Item Search",
    "BarcodeScanner": true,
    "MinimumCharacterThreshold": 4
  };
  listPickerFormCell.setIsSearchCancelledAfterSelection(false);
  listPickerFormCell.setSearch(searchObj)
  listPickerFormCell.setAllowEmptySelection(true);
  listPickerFormCell.setIsPickerDismissedOnSelection(false)

  var dataPaging =  {
    "ShowLoadingIndicator": true,
    "LoadingIndicatorText": 'Loading more items, please wait…',
    "PageSize": 10
  };

  listPickerFormCell.setDataPaging(dataPaging)
  

  var noteFormCell = pageProxy.evaluateTargetPathForAPI("#Control:NoteFormCell");
  noteFormCell.setMaxNumberOfLines(20);
  noteFormCell.setMinNumberOfLines(10);
  noteFormCell.setPlaceHolder("New Place Holder");

  var titleFormCell = pageProxy.evaluateTargetPathForAPI("#Control:TitleCell");
  titleFormCell.setPlaceHolder("New Title PlaceHolder");

  var segmentedFormCell = pageProxy.evaluateTargetPathForAPI("#Control:SegmentedControl");
  segmentedFormCell.setApportionsSegmentWidthsByContent(false);
  segmentedFormCell.setApportionsSegmentWidthsByContent(true);
  segmentedFormCell.setSegments([
                  "Low",
                  "Medium",
                  "High",
                  "Very High"
              ]) 

  var durationFormCell = pageProxy.evaluateTargetPathForAPI("#Control:DurationFormCell");
  durationFormCell.setUnit("S");
  durationFormCell.setMinuteInterval(10);

  var datePickerFormCell = pageProxy.evaluateTargetPathForAPI("#Control:DatePickerFormCell");
  datePickerFormCell.setMode("date");
  

  var  listPickerFormCell1 = pageProxy.evaluateTargetPathForAPI("#Control:ListPicker1");
  var pi = [
    {ReturnValue: 'One', DisplayValue: 'OneDisplay'},
    {ReturnValue: 'Two', DisplayValue: 'TwoDisplay'},
    {ReturnValue: 'Three', DisplayValue: 'ThreeDisplay'},
    {ReturnValue: 'Four', DisplayValue: 'FourDisplay'}];
  listPickerFormCell1.setPickerItems(pi);
  listPickerFormCell1.setPickerPrompt("New Picker Prompt");
  listPickerFormCell1.setPickerItems(pi);

  var  attachmenFormCell = pageProxy.evaluateTargetPathForAPI("#Control:AttachmentFormCell");
  attachmenFormCell.setAllowedFileTypes([".jpeg", ".pdf", ".png"]);
  attachmenFormCell.setAttachmentTitle("New Title");
  attachmenFormCell.setAttachmentAddTitle("New Add Title");
  attachmenFormCell.setAttachmentCancelTitle("New Cancel Title");
  attachmenFormCell.setAttachmentActionType(["AddPhoto", "TakePhoto", "SelectFile"]);

  var signatureCellFormCell = pageProxy.evaluateTargetPathForAPI("#Control:SignatureCell");
  signatureCellFormCell.setCapturedStatusText("New Signature Captured!");
  signatureCellFormCell.setInitialStatusText("New Please capture a signature");
  signatureCellFormCell.setShowUnderline(false);
  signatureCellFormCell.setShowTimestampInImage(false);
  signatureCellFormCell.setShowXMark(false);
  signatureCellFormCell.setTimestampFormatter('mm-dd-yyyy');
  signatureCellFormCell.setWatermarkText("New watermark text");
  signatureCellFormCell.setWatermarkTextMaxLines(3);

  var inLinesignatureCellFormCell = pageProxy.evaluateTargetPathForAPI("#Control:InlineSignatureCell");
  inLinesignatureCellFormCell.setShowUnderline(false);
  inLinesignatureCellFormCell.setShowTimestampInImage(false);
  inLinesignatureCellFormCell.setShowXMark(false);
  inLinesignatureCellFormCell.setTimestampFormatter('mm-dd-yyyy');
  inLinesignatureCellFormCell.setWatermarkText("New watermark text");
  inLinesignatureCellFormCell.setWatermarkTextMaxLines(3);
  
}
