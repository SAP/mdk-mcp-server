export default function SectionedTableRedraw(pageProxy) {
  const sectionedTable = pageProxy.getControl('MultiSelectionSectionedTable');
  sectionedTable.redraw();
}

