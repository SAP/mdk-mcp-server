export default function GetChanges(context) {
    const sectionedTable = context.getControl('SectionedTable');
    const section = sectionedTable.getSection('DataTableSection');
    let changedObjects = section.getChanges();
    
    alert(JSON.stringify(changedObjects));
  }