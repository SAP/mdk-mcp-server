export default function GetSectionSelectionItems(pageProxy) {
  const sectionedTable = pageProxy.getControl('MultiSelectionSectionedTable');
  let sections = sectionedTable.getSections();
  alert(sections[0].getSelectedItems().length);
}

