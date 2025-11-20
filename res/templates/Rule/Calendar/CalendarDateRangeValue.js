export default function CalendarDateRangeValue(context) {
  let startDate = new Date();
  let endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7);
  return {
    'StartDate': startDate,
    'EndDate': endDate,
  }
}