export default function ToggleOffSectionSelectionMode(pageProxy) {
  const sectionedTable = pageProxy.getControl('MultiSelectionSectionedTable');
  let sections = sectionedTable.getSections();
  sections[0].setSelectionMode("None");
}

