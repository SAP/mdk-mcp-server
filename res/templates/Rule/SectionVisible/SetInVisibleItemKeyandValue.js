import VisibilityItemKeyandValueHelper from "./VisibilityItemKeyandValueHelper"

export default function SetInVisibleItemKeyandValue(pageProxy) {
    VisibilityItemKeyandValueHelper.setBoolVal(false);
  const sectionedTable = pageProxy.getControl('SectionedTable');
  sectionedTable.redraw();
}