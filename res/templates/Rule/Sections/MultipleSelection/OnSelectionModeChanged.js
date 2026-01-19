export default function OnSelectionModeChanged(sectionedTableProxy) {
    let sections = sectionedTableProxy.getSections();
    let selectionMode = sections[0].getSelectionMode();
    alert('Section Selection Mode: ' + selectionMode);
  }
  