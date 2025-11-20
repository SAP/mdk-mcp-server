export default function ResetAllSectionQO(context) {
  var mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  var mainPageData = mainPage.getClientData();
  if (mainPageData) {
    mainPageData['GroupQO'] = '$top=1';
  }
  return '';
}