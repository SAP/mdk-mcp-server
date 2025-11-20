export default function SectionReset(context) {
  const sectionedTable = context.getControl('SectionedTable');
  let section1 = sectionedTable.getSection('FormCellSection1');
  let section2 = sectionedTable.getSection('FormCellSection2');
  
  section1.reset();
  section2.reset();
}