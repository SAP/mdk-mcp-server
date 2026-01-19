import VisibilityItemKeyandValueHelper from "./VisibilityItemKeyandValueHelper"

export default function SetVisibleItemKeyandValue(pageProxy) {
    VisibilityItemKeyandValueHelper.setBoolVal(true);
  const sectionedTable = pageProxy.getControl('SectionedTable');
  sectionedTable.redraw();
}