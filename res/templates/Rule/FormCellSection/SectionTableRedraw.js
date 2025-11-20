export default function SectionTableRedraw(controlProxy) {
  const sectionedTable = controlProxy.getPageProxy().getControl('SectionedTable');
  sectionedTable.redraw();
}
