export default function SectionRedraw(controlProxy) {
  const sectionedTable = controlProxy.getPageProxy().getControl('SectionedTable');
  let section1 = sectionedTable.getSection('FormCellSection1');
  section1.redraw();
}
