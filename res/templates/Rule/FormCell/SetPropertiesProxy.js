export default function SetPropertiesProxy(pageProxy) {
  var formCellContainerProxy = pageProxy.getControl('FormCellContainer');

  var switchFormCellProxy = formCellContainerProxy.getControl('Switch');
  switchFormCellProxy.setCaption("Proxy, Switch New Caption");
  switchFormCellProxy.setEnable(false);
  switchFormCellProxy.setHelperText('Proxy, New Switch Helper Text');
  
  var buttonFormCellProxy = formCellContainerProxy.getControl('ButtonCell');
  buttonFormCellProxy.setTitle("Proxy Button New Title");
  buttonFormCellProxy.setTextAlignment("right");
  buttonFormCellProxy.setButtonType('Normal');

  var durationFormCellProxy = formCellContainerProxy.getControl("DurationFormCell");
  durationFormCellProxy.setUnit("S");
  durationFormCellProxy.setMinuteInterval(10);

  var datePickerFormCellProxy = formCellContainerProxy.getControl("DatePickerFormCell");
  datePickerFormCellProxy.setMode("date");

  var simplePropertyFormCell = formCellContainerProxy.getControl("SimplePropertyFormCellCtrl");
  simplePropertyFormCell.setAlternateInput("Barcode");
  simplePropertyFormCell.setKeyboardType("Number");
  simplePropertyFormCell.setPlaceHolder('Ned Place Holder');

  var  listPickerFormCell = formCellContainerProxy.getControl("ListPicker");
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
  var  listPickerFormCell1 = formCellContainerProxy.getControl("ListPicker1");
  var pi = [
    {ReturnValue: 'One', DisplayValue: 'OneDisplay'},
    {ReturnValue: 'Two', DisplayValue: 'TwoDisplay'},
    {ReturnValue: 'Three', DisplayValue: 'ThreeDisplay'},
    {ReturnValue: 'Four', DisplayValue: 'FourDisplay'}];
  listPickerFormCell1.setPickerItems(pi);
  listPickerFormCell1.setPickerPrompt("New Picker Prompt");

  var noteFormCell = formCellContainerProxy.getControl("NoteFormCell");
  noteFormCell.setMaxNumberOfLines(10);
  noteFormCell.getMinNumberOfLines(5);
  noteFormCell.getPlaceHolder();
}
