export default function SectionVisibleQO(context) {
  var mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  var mainPageData = mainPage.getClientData();
  if (mainPageData) {
    return mainPageData['GroupQO'];
  }
  return '';
}