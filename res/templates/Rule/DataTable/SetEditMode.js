
export default function SetEditMode(context) {
    const sectionedTable = context.getControl('SectionedTable');
    const section = sectionedTable.getSection('DataTableSection');
    section.setEditMode('Inline');
  }