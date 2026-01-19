export default function SetSectionVisibility(context) {
    var flag = true;
    context.setSectionVisibilityAtIndex(1, !flag);
    alert("Section Visibility Change");
  }