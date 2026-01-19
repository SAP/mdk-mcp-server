export default function ApplyStylesCommon(clientAPI, selection) {
  const sectionedTable = clientAPI.evaluateTargetPathForAPI('#Page:-Current/#Control:SectionedTable');
  const formCellSection1 = sectionedTable.getSection('FormCellSection1');

  const date1 = clientAPI.evaluateTargetPath('#Page:StylesPage/#Control:DatePicker1');
  const switch1 = clientAPI.evaluateTargetPath('#Page:StylesPage/#Control:MasterSwitchCell');
  const title1 = clientAPI.evaluateTargetPath('#Page:StylesPage/#Control:TitleFormCell1');
  const noteCell = clientAPI.evaluateTargetPath('#Page:StylesPage/#Control:NoteFormCell1');

  if (switch1.getValue()) {
    date1.setStyle("background-critical", "Background");
    date1.setStyle("text-green-italic", "Caption");
    date1.setStyle("text-blue-normal", "Value");

    switch1.setStyle("background-critical", "Background");
    switch1.setStyle("text-green-italic", "Caption");
    switch1.setStyle("switch-critical", "Switch");

    title1.setStyle("text-critical-bold", "Value");
    title1.setStyle("background-green", "Background");

    noteCell.setStyle("FormCellNoteTextCritical", "Value");
    noteCell.setStyle("FormCellCaptionCritical", "Caption");
    noteCell.setStyle("FormCellBackgroundCritical", "Background");
  } else {
    date1.setStyle("background-yellow1", "Background");
    date1.setStyle("text-blue-normal", "Caption");
    date1.setStyle("text-green-italic", "Value");

    switch1.setStyle("background-yellow1", "Background");
    switch1.setStyle("text-blue-normal", "Caption");
    switch1.setStyle("", "Switch");

    title1.setStyle("text-green-italic", "Value");
    title1.setStyle("background-critical", "Background");

    noteCell.setStyle("FormCellNoteTextStandard", "Value");
    noteCell.setStyle("FormCellCaptionStandard", "Caption");
    noteCell.setStyle("FormCellBackgroundStandard", "Background");
  }

  if (selection === 'controls') {
    date1.redraw();
    switch1.redraw();
    title1.redraw();
    noteCell.redraw();
  } else if (selection === 'section') {
    formCellSection1.redraw();
  } else if (selection === 'sectionedtable') {
    sectionedTable.redraw();
  } else if (selection === 'page') {
    clientAPI.getPageProxy().redraw();
  } else {
    clientAPI.getPageProxy().redraw();
  }
}
