export default function GetIndicatorName(context) {
  let matchedDate = context.binding.Date;
  console.log("Matched Date:", matchedDate);
  let entitySets = context.binding.EntitySets;
  if (entitySets.MyWorkOrderHeaders && entitySets.MyWorkOrderHeaders.length > 0) {
    return "DueDateIndicator";
  } else if (entitySets.MyWorkOrderOperations && entitySets.MyWorkOrderOperations.length > 0) {
    return "StartDateIndicator";
  } else {
    return null;
  }
}
