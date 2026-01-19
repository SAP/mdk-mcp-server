export default function GroupDVisible(context) {
  let mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  let mainPageData = mainPage.getClientData();
  if (mainPageData) {
    return mainPageData['GroupD_Visible'];
  } else {
    return false;
  }
}
