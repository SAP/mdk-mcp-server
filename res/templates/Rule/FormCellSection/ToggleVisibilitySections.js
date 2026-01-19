export default function ToggleVisibilitySections(controlProxy) {
  const sectionedTable = controlProxy.getPageProxy().getControl('SectionedTable');
  let section3 = sectionedTable.getSection('FormCellSection3');
  let section4 = sectionedTable.getSection('FormCellSection4');
  
  section3.setVisible(!section3.getVisible());
  section4.setVisible(!section4.getVisible());
}
