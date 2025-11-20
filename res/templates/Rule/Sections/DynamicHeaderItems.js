export default function DynamicHeaderItems(context) {
  return [
    {
      "_Type": "SectionHeaderItem.Type.Button",
      "_Name": "button14a",
      "Title": "Button 14a",
      "Position": "Left",
      "Image": "/MDKDevApp/Images/extension.png",
      "ImagePosition": "Leading",
      "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
    }, {
      "_Type": "SectionHeaderItem.Type.Button",
      "_Name": "button14b",
      "Title": "Button 14b",
      "Position": "Right",
      "Image": "sap-icon://customer-and-supplier",
      "ImagePosition": "Trailing",
      "Semantic": "Negative",
      "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
    }
  ];
}
