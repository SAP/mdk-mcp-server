export default function FormCellListPickerObjectCellItems(context) {
  return [{
      ObjectCell: {
        Title: "Distance",
        Subhead: "Distance Unit",
        Description: "Distance Description",
        DetailImage: "/MDKDevApp/Images/workorder.png",
        Icons: [
          "/MDKDevApp/Images/icon_severity_medium.png",
          "/MDKDevApp/Images/open.png"
        ],
        StatusImage: "/MDKDevApp/Images/workorder_details.png"
      },
      ReturnValue: "Distance"
    },
    {
      ObjectCell: {
        Title: "Touch ID",
        Subhead: "Touch ID & Passcode",
        Description: "Touch ID Description",
        DetailImage: "/MDKDevApp/Images/icon.png",
        Icons: [
          "/MDKDevApp/Images/icon_severity_medium.png",
          "/MDKDevApp/Images/open.png"
        ],
        StatusImage: "/MDKDevApp/Images/workorder_details.png"
      },
      ReturnValue: "Touch ID"
    }
  ];
}