export default function SectionDQO(context) {
  var mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  var mainPageData = mainPage.getClientData();
  if (mainPageData) {
    return mainPageData['GroupD_SectionQO'] || '$top=1';
  }
  return '$top=1';
}