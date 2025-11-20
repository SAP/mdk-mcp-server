export default function SimplePropertyValueChange(context) {
  // get current page
  let currentPage = context.evaluateTargetPath('#Page:-Current');
  //get current page proxy
  let currentPageAPI = context.evaluateTargetPathForAPI('#Page:-Current');
  // get SimplePropertyFormCell6 control in the current page
  let control = context.evaluateTargetPath('#Page:-Current/#Control:SimplePropertyFormCell6');
  // get SimplePropertyFormCell6 cotrol value
  let controlValue = context.evaluateTargetPath('#Page:-Current/#Control:SimplePropertyFormCell6/#Value');
  // get SimplePropertyFormCell5 control proxy
  let controlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:SimplePropertyFormCell5');

  // get current page proxy by the context
  let pageProxy = context.getPageProxy();
}