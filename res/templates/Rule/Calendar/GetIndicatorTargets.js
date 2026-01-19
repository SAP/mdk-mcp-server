export default function GetIndicatorTargets(context) {
  return [
    {
      EntitySet: "MyWorkOrderHeaders",
      Service: "/MDKDevApp/Services/Amw.service",
      QueryOptions: "$filter=OrderType ne 'PM02'",
      DateProperties: [
        "CreationDate",
        "DueDate"
      ]
    },
    {
      EntitySet: "MyWorkOrderOperations",
      Service: "/MDKDevApp/Services/Amw.service",
      DateProperties: [
        "SchedEarliestStartDate",
        "SchedEarliestEndDate"
      ]
    }
  ];
}
