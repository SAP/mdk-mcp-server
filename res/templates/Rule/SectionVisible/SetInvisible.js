export default function SetInvisible(context) {
  let sections = context.getPageProxy().getControl('SectionedTable').getSections();
  for (var i = 0; i < sections.length - 1; i++) {
    sections[i].setVisible(false, false);
  }
}