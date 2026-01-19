export default function ExtendedHeaderArray(clientAPI) {
    try {
        if (clientAPI.binding) {
            let orderIdString = clientAPI.binding.OrderId;
            let orderIdSubstring = orderIdString.substr(orderIdString.length - 3, 3);
            let orderIdInt = parseInt(orderIdSubstring);
            if (orderIdInt % 2 == 0) {
                return [
                        {
                          "_Type": "CardHeader.Type.ExtendedHeader",
                          "ItemType": "Label",
                          "ItemSeparator": true,
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
                        },
                        {
                          "_Type": "CardHeader.Type.ExtendedHeader",
                          "ItemType": "Rating",
                          "Items": [
                            {
                              "_Type": "CardHeaderExtendedHeader.Type.Rating",
                              "_Name": "CA_EHR_1a",
                              "Score": 2,
                              "Label": "256 Reviews"
                            },
                            {
                              "_Type": "CardHeaderExtendedHeader.Type.Rating",
                              "_Name": "CA_EHR_2a",
                              "Score": 3,
                              "Label": "56 Reviews"
                            }
                          ]
                        },
                        {
                          "_Type": "CardHeader.Type.ExtendedHeader",
                          "ItemType": "Tag",
                          "Items": [
                            {
                              "_Type": "CardHeaderExtendedHeader.Type.Tag",
                              "Text": "{ObjectType}",
                              "Color": "#00ff00",
                              "Style": "Tag1Syle"
                            },
                            {
                              "_Type": "CardHeaderExtendedHeader.Type.Tag",
                              "Text": "{ControlKey}",
                              "Color": "blue",
                              "Style": "Tag2Style"
                            }
                          ]
                        }
                    ];
            } else {
                return [
                        {
                          "_Type": "CardHeader.Type.ExtendedHeader",
                          "Items": [
                            {
                              "_Type": "CardHeaderExtendedHeader.Type.Rating",
                              "_Name": "CA_EHR_1a",
                              "Score": 2,
                              "Label": "256 Reviews"
                            },
                            {
                              "_Type": "CardHeaderExtendedHeader.Type.Rating",
                              "_Name": "CA_EHR_2a",
                              "Score": 3,
                              "Label": "56 Reviews"
                            }
                          ]
                        },
                        {
                          "_Type": "CardHeader.Type.ExtendedHeader",
                          "Items": [
                            {
                              "_Type": "CardHeaderExtendedHeader.Type.Tag",
                              "Text": "{ObjectType}",
                              "Color": "#00ff00",
                              "Style": "Tag1Syle"
                            },
                            {
                              "_Type": "CardHeaderExtendedHeader.Type.Tag",
                              "Text": "{ControlKey}",
                              "Color": "blue",
                              "Style": "Tag2Style"
                            }
                          ]
                        }
                    ];
            }
        }
    } catch(e) {
        console.log(e);
    }
    return true;
}
