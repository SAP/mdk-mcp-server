export default function GetSelectedDate(context) {
  let message;
  if (context.getCalendarType() === 'DateRange') {
    let selectedDateRange = context.getSelectedDateRange();
    if (selectedDateRange) {
      let startDateString = context.getSelectedDateRange().startDate.toString();
      let endDateString = context.getSelectedDateRange().endDate.toString();
      message = '\n\nStart date: ' + startDateString + '\nEnd date: ' + endDateString;
    }
  } else {
    message = context.getSelectedDate();
    console.log("Indicator Name:", context.binding.IndicatorName);
    let entitySets = context.binding.EntitySets;
    if (entitySets) {
      if (entitySets.MyWorkOrderHeaders && entitySets.MyWorkOrderHeaders.length > 0) {
        console.log("MyWorkOrderHeaders found, setting indicator to DueDateIndicator");
      } else if (entitySets.MyWorkOrderOperations && entitySets.MyWorkOrderOperations.length > 0) {
        console.log("MyWorkOrderOperations found, setting indicator to StartDateIndicator");
      } else {
        console.log("No relevant entity sets found");
      }
    }
  }
  if (message) {
    context.getPageProxy().getClientData().Message = message;
    return context.executeAction('/MDKDevApp/Actions/Messages/ShowDateMessage.action');
  }
}