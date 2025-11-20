export default function CardTestHeaderExtendedHeaders(context) {
    let controlPageProxy = context.evaluateTargetPathForAPI('#Page:CardTestControlPage');
    if (controlPageProxy) {
      let pageClientData = controlPageProxy.getClientData();
      let extHeaders = [];
      let extHeaderLabel = {
        "_Type": "CardHeader.Type.ExtendedHeader",
        "ItemType": "Label",
        "ItemSeparator":  "#Page:CardTestControlPage/#Control:HeaderExtendedHeaderItemSeparatorSwitch/#Value",
        "Items": [
          {
            "_Type": "CardHeaderExtendedHeader.Type.Label",
            "_Name": "CA_EHL_1a",
            "Text": "Negative",
            "Image": "sap-icon://warning",
            "ImagePosition": "Trailing"
          },
          {
            "_Type": "CardHeaderExtendedHeader.Type.Label",
            "_Name": "CA_EHL_2a",
            "Text": "Critical"
          }
        ]
      };
      let extHeaderRating = {
          "_Type": "CardHeader.Type.ExtendedHeader",
          "ItemType": "Rating",
          "ItemSeparator":  "#Page:CardTestControlPage/#Control:HeaderExtendedHeaderItemSeparatorSwitch/#Value",
          "Items": [
            {
              "_Type": "CardHeaderExtendedHeader.Type.Rating",
              "_Name": "CA_EHR_1a",
              "Score": 2,
              "IconOn": "sap-icon://heart",
              "IconOff": "sap-icon://heart-2",
              "Label": "256 Reviews"
            }
          ]
        };
      let extHeaderTags = {
          "_Type": "CardHeader.Type.ExtendedHeader",
          "ItemType": "Tag",
          "ItemSeparator":  "#Page:CardTestControlPage/#Control:HeaderExtendedHeaderItemSeparatorSwitch/#Value",
          "Items": [
            {
              "_Type": "CardHeaderExtendedHeader.Type.Tag",
              "Text": "999",
              "Color": "#00ff00",
              "Style": "Tag1Syle"
            },
            {
              "_Type": "CardHeaderExtendedHeader.Type.Tag",
              "Text": "Tag2",
              "Color": "blue",
              "Style": "Tag2Style"
            }
          ]
        };

      if (pageClientData.HeaderExtendedHeaders === 'One') {
        extHeaders.push(extHeaderLabel);
      } else if (pageClientData.HeaderExtendedHeaders === 'Two') {
        extHeaders.push(extHeaderLabel);
        extHeaders.push(extHeaderRating);
      } else if (pageClientData.HeaderExtendedHeaders === 'Three') {
        extHeaders.push(extHeaderLabel);
        extHeaders.push(extHeaderRating);        
        extHeaders.push(extHeaderTags);
      }
      return extHeaders;
    }
}
