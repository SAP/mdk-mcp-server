export default function ToggleValues(controlProxy) {
  const sectionedTable = controlProxy.getPageProxy().getControl('SectionedTable');
  let section8 = sectionedTable.getSection('FormCellSection8');
  let noetControl = section8.getControl("LongTextNote");
  if (noetControl) {
    noetControl.setValue(noetControl.getValue() ? "" : "This is a long text note.");
  }

  let section1 = sectionedTable.getSection('FormCellSection1');
  noetControl = section1.getControl("NotificationDescription");
  if (noetControl) {
    noetControl.setValue(noetControl.getValue() ? "" : "This is a long text note.");
  }
}
