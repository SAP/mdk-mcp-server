export default function ToggleOnSectionSelectionMode(pageProxy) {
  const sectionedTable = pageProxy.getControl('MultiSelectionSectionedTable');
  let sections = sectionedTable.getSections();
  sections[0].setSelectionMode("Multiple");
}

