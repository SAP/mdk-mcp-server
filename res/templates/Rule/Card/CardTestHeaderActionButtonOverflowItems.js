export default function CardTestHeaderActionButtonOverflowItems(context) {
    let controlPageProxy = context.evaluateTargetPathForAPI('#Page:CardTestControlPage');
    if (controlPageProxy) {
      let pageClientData = controlPageProxy.getClientData();
      if (pageClientData.HeaderActionButtonOverflowItems) {
        return [
            {
              "_Name":"menuAction1",
              "Title":"Action 1",
              "Image":"sap-icon://badge",
              "Visible":true,
              "OnPress": "/MDKDevApp/Rules/Card/ShowToastMessage.js"
            },
            {
              "_Name":"menuAction2",
              "Title":"Action 2",
              "Visible": "#Page:CardTestControlPage/#Control:HeaderActionButtonOverflowItemAction2VisibleSwitch/#Value",
              "Image":"sap-icon://background",
              "OnPress": "/MDKDevApp/Rules/Card/ShowToastMessage.js"
            }
          ];
      } else {
        return [];
      }
    }
}
