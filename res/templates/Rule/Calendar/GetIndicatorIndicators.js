export default function GetIndicatorIndicators(context) {
  return [
    {
      Icon: "SFSymbol:circle.fill",
      Title: "Due Date",
      Styles: {
        Icon: "OrangeColor"
      },
      _Name: "DueDateIndicator"
    },
    {
      Icon: "SFSymbol:triangle.fill",
      Title: "Start Date",
      Styles: {
        Icon: "GrayColor"
      },
      _Name: "StartDateIndicator"
    }
  ];
}
