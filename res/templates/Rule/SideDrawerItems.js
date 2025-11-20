export default function SideDrawerItems(context) {
    let items;
    items = [ 
        {
          "Title" : "/MDKDevApp/Rules/TextForIOS.js",
          "Image" : "/MDKDevApp/Rules/GetDynamicImage.js",
          "OnPress": "/MDKDevApp/Actions/Messages/Message.action",
          "PageToOpen" : "/MDKDevApp/Pages/Examples/FeatureCategory.page",
          "Visible":"/MDKDevApp/Rules/AlwaysTrue.js",
          "ResetIfPressedWhenActive": true,
          "_Name": "FeatureCategory"
        },
        {
          "Title" : "/MDKDevApp/Rules/OData/TotalWorkOrders.js",
          "Image" : "/MDKDevApp/Rules/GetDynamicImage.js",
          "PageToOpen" : "/MDKDevApp/Pages/OData/WorkOrder/WorkOrderList.page",
          "ResetIfPressedWhenActive": true,
          "_Name": "WorkOrderList"
        },
        {
          "Title" : "/MDKDevApp/Rules/GetCaption.js",
          "Image" : "/MDKDevApp/Rules/GetDynamicImage.js",
          "PageToOpen" : "/MDKDevApp/Pages/Examples/ActionExamples.page",
          "_Name": "ActionExamples"
        },
        {
          "Title" : "Fiori Controls",
          "Image" : "/MDKDevApp/Rules/GetDynamicImage.js",
          "PageToOpen" : "/MDKDevApp/Pages/Examples/ControlExamples.page",
          "_Name": "ControlExamples"
        }
    ];
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    let maxItems = Math.floor(Math.random() * 4);
    items = items.slice(0, maxItems);
    return items;
  }
