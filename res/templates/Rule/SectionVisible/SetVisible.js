export default function SetVisible(context) {
  let sections = context.getPageProxy().getControl('SectionedTable').getSections();
  for (var i = 0; i < sections.length - 1; i++) {
    sections[i].setVisible(true, false);
  }
}