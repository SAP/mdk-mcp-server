export default function OnSelectionModeChanged2(sectionedTableProxy) {
    let sections = sectionedTableProxy.getSections();
    let selectionMode = sections[1].getSelectionMode();
    alert('Section Selection Mode: ' + selectionMode);
  }
  