export default function SetNUIStyles(clientAPI) {
  const switchCell = clientAPI.evaluateTargetPath('#Page:-Current/#Control:MasterSwitchCell');
  const buttonCell = clientAPI.evaluateTargetPath('#Page:-Current/#Control:copy_button');
  const noteCell = clientAPI.evaluateTargetPath('#Page:-Current/#Control:NoteFormCell');
  const noteCell2 = clientAPI.evaluateTargetPath('#Page:-Current/#Control:NoteFormCell2');
  const titleCell = clientAPI.evaluateTargetPath('#Page:-Current/#Control:TitleFormCell');
  const datePicker = clientAPI.evaluateTargetPath('#Page:-Current/#Control:DatePicker');
  const attachment = clientAPI.evaluateTargetPath('#Page:-Current/#Control:Attachment');
  const property = clientAPI.evaluateTargetPath('#Page:-Current/#Control:SimplePropertyFormCell');

  const listpicker1 = clientAPI.evaluateTargetPath('#Page:-Current/#Control:ListPicker1');
  const listpicker2 = clientAPI.evaluateTargetPath('#Page:-Current/#Control:ListPicker2');

  const objectCellListpicker1 = clientAPI.evaluateTargetPath('#Page:-Current/#Control:ObjectCellListPicker1');
  const objectCellListpicker2 = clientAPI.evaluateTargetPath('#Page:-Current/#Control:ObjectCellListPicker2');

  const segmented = clientAPI.evaluateTargetPath('#Page:-Current/#Control:SegmentedControl');
  const duration = clientAPI.evaluateTargetPath('#Page:-Current/#Control:DurationControl');

  const switchCellGetViaRule = clientAPI.evaluateTargetPath('#Page:-Current/#Control:SwitchCellGetViaRule');
  const switchCellSetViaRule = clientAPI.evaluateTargetPath('#Page:-Current/#Control:SwitchCellSetViaRule');

  const segmented2 = clientAPI.evaluateTargetPath('#Page:-Current/#Control:SegmentedControl2');

  const formcellCont = clientAPI.evaluateTargetPathForAPI('#Page:-Current/#Control:FormCellContainer');

  const signatureCell = clientAPI.evaluateTargetPathForAPI('#Page:-Current/#Control:SignatureCell1');
  const inlineSignatureCell = clientAPI.evaluateTargetPathForAPI('#Page:-Current/#Control:InlineSignatureCell1');

  if (switchCell.getValue()) {
    // use the ClientAPI
  	clientAPI.setStyle("FormCellLabelCritical", "Caption");
  	clientAPI.setStyle("FormCellSwitchCritical", "Switch");
    clientAPI.setStyle("FormCellBackgroundCritical", "");

    switchCell.setValue(true, false);

    buttonCell.setStyle("FormCellLabelCritical", "Button");

    switchCellGetViaRule.setStyle("FormCellBackgroundCritical", "Background");
    switchCellGetViaRule.setStyle("FormCellLabelCritical", "Caption");
  	switchCellGetViaRule.setStyle("FormCellSwitchCritical", "Switch");

    switchCellSetViaRule.setStyle("FormCellBackgroundCritical", "Background");
    switchCellSetViaRule.setStyle("FormCellLabelCritical", "Caption");
  	switchCellSetViaRule.setStyle("FormCellSwitchCritical", "Switch");

    noteCell.setStyle("FormCellNoteTextCritical", "Value");
    noteCell.setStyle("FormCellCaptionCritical", "Caption");
    noteCell.setStyle("FormCellBackgroundCritical", "Background");

    noteCell2.setStyle("FormCellNoteTextCritical", "Value");
    noteCell2.setStyle("FormCellCaptionCritical", "Caption");
    noteCell2.setStyle("FormCellBackgroundCritical", "Background");

    titleCell.setStyle("FormCellTitleTextCritical", "Value");
    titleCell.setStyle("FormCellBackgroundCriticalTitle", "Background");

    datePicker.setStyle("FormCellLabelCritical", "Caption");
    datePicker.setStyle("FormCellValueCritical", "Value");
    datePicker.setStyle("FormCellBackgroundCritical", "Background");

    attachment.setStyle("FormCellBackgroundCritical", "Background");

    property.setStyle("FormCellBackgroundCritical", "Background");
    property.setStyle("FormCellLabelPropertyCritical", "Caption");
    property.setStyle("FormCellValuePropertyCritical", "Value");

    listpicker1.setStyle("FormCellBackgroundCritical", "Background");

    listpicker2.setStyle("FormCellBackgroundCritical", "Background");
    listpicker2.setStyle("FormCellLabelPickerCritical", "Caption");
    listpicker2.setStyle("FormCellValuePickerCritical", "Value");

    objectCellListpicker1.setStyle("FormCellBackgroundCritical", "Background");

    objectCellListpicker2.setStyle("FormCellBackgroundCritical", "Background");
    objectCellListpicker2.setStyle("FormCellLabelPickerCritical", "Caption");
    objectCellListpicker2.setStyle("FormCellValuePickerCritical", "Value");

    segmented.setStyle("FormCellBackgroundCritical", "Background");
    segmented.setStyle("FormCellLabelCritical", "Caption");
    
    segmented2.setStyle("FormCellBackgroundCritical", "Background");
    segmented2.setStyle("FormCellLabelCritical", "Caption");

    duration.setStyle("FormCellBackgroundCritical", "Background");
    duration.setStyle("FormCellLabelPropertyCritical", "Caption");
    duration.setStyle("FormCellValuePropertyCritical", "Value");

    formcellCont.setStyle("FormCellContainerBackgroundCritical");

    signatureCell.setStyle("FormCellLabelPropertyCritical", "Caption");
    signatureCell.setStyle("FormCellValuePropertyCritical", "Value");

    inlineSignatureCell.setStyle("FormCellLabelPropertyCritical", "Caption");
  } else {
    // use the ClientAPI
  	clientAPI.setStyle("FormCellLabelStandard", "Caption");
  	clientAPI.setStyle("FormCellSwitchStandard", "Switch");
    clientAPI.setStyle("FormCellBackgroundStandard", "Background");

    switchCell.setValue(false, false);

    buttonCell.setStyle("FormCellLabelStandard", "Button");

    switchCellGetViaRule.setStyle("FormCellBackgroundStandard", "Background");
    switchCellGetViaRule.setStyle("FormCellLabelStandard", "Caption");
  	switchCellGetViaRule.setStyle("FormCellSwitchStandard", "Switch");

    switchCellSetViaRule.setStyle("FormCellBackgroundStandard", "Background");
    switchCellSetViaRule.setStyle("FormCellLabelStandard", "Caption");
  	switchCellSetViaRule.setStyle("FormCellSwitchStandard", "Switch");

    noteCell.setStyle("FormCellNoteTextStandard", "Value");
    noteCell.setStyle("FormCellCaptionStandard", "Caption");
    noteCell.setStyle("FormCellBackgroundStandard", "Background");

    noteCell2.setStyle("FormCellNoteTextStandard2", "Value");
    noteCell2.setStyle("FormCellCaptionStandard2", "Caption");
    noteCell2.setStyle("FormCellBackgroundStandard2", "Background");

    titleCell.setStyle("FormCellTitleTextStandard", "Value");
    titleCell.setStyle("FormCellBackgroundStandardTitle", "Background");

    datePicker.setStyle("FormCellLabelStandard", "Caption");
    datePicker.setStyle("FormCellValueStandard", "Value");
    datePicker.setStyle("FormCellBackgroundStandard", "Background");

    attachment.setStyle("FormCellBackgroundStandard", "Background");

    property.setStyle("FormCellBackgroundStandard", "Background");
    property.setStyle("FormCellLabelPropertyStandard", "Caption");
    property.setStyle("FormCellValuePropertyStandard", "Value");

    listpicker1.setStyle("FormCellBackgroundStandard", "Background");

    listpicker2.setStyle("FormCellBackgroundStandard", "Background");
    listpicker2.setStyle("FormCellLabelPickerStandard", "Caption");
    listpicker2.setStyle("FormCellValuePickerStandard", "Value");

    objectCellListpicker1.setStyle("FormCellBackgroundStandard", "Background");

    objectCellListpicker2.setStyle("FormCellBackgroundStandard", "Background");
    objectCellListpicker2.setStyle("FormCellLabelPickerStandard", "Caption");
    objectCellListpicker2.setStyle("FormCellValuePickerStandard", "Value");

    segmented.setStyle("FormCellBackgroundStandard", "Background");
    segmented.setStyle("FormCellLabelStandard", "Caption");

    segmented2.setStyle("FormCellBackgroundStandard", "Background");
    segmented2.setStyle("FormCellLabelStandard", "Caption");

    duration.setStyle("FormCellBackgroundStandard", "Background");
    duration.setStyle("FormCellLabelPropertyStandard", "Caption");
    duration.setStyle("FormCellValuePropertyStandard", "Value");

    formcellCont.setStyle("FormCellContainerBackgroundStandard");

    signatureCell.setStyle("FormCellLabelPropertyStandard", "Caption");
    signatureCell.setStyle("FormCellValuePropertyStandard", "Value");

    inlineSignatureCell.setStyle("FormCellLabelPropertyStandard", "Caption");
  }
  formcellCont.redraw();
}
