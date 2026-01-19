export default function Save(context) {
    const sectionedTable = context.getControl('SectionedTable');
    const section = sectionedTable.getSection('DataTableSection');
    let changedObjects = section.getChanges();
  
    let actions = [];
    for (var i = 0; i < changedObjects.length; i++) {
      actions.push({
        Name: '/MDKDevApp/Actions/OData/DataTable/UpdateWO.action',
        Properties: {
          Target: {
            ReadLink: changedObjects[i].readLink
          },
          Properties: changedObjects[i].changedProperties
        }
      });
    }
  
    return context.executeAction({
      Name: '/MDKDevApp/Actions/OData/DataTable/ChangeSet.action',
      Properties: {
        Actions: actions
      }
    }).then(data => {
      section.setEditMode("None");
    }).catch(err => {
        alert(err.toString())
    });
  }