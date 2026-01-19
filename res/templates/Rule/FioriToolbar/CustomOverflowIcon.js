export default function CustomOverflowIcon(context) {
  let page = context.getPageProxy().evaluateTargetPath('#Page:FioriToolbarExamples');
  if (page) {
    let customIcon = page.context.clientData.CustomOverflowIcon;
    if (customIcon) {
      return 'sap-icon://home';
    } else {
      return '';
    }
  }
}