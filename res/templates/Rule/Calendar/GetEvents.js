let flag = false;
export default function GetEvents(context) {
  if (flag) {
    flag = false;
    return [
      {
        "Date": "2025-10-26T03:00:00",
        "IndicatorName": "StartDateIndicator"
      },
      {
        "Date": "2025-10-30T08:00:00",
        "IndicatorName": "DueDateIndicator"
      }
    ];
  } else {
    flag = true;
    return [
      {
        "Date": "2023-05-30T15:20:00",
        "IndicatorName": "StartDateIndicator"
      },
      {
        "Date": "2023-05-31T03:00:00",
        "IndicatorName": "DueDateIndicator"
      },
      {
        "Date": "2025-06-30T08:00:00",
        "IndicatorName": "DueDateIndicator"
      },
      {
        "Date": "2025-10-01T08:00:00",
        "IndicatorName": "StartDateIndicator"
      }
    ];
  }
}
