export default function CardStaticContentLabelBarItems(clientAPI) {
  return  [
    {
      "_Type": "CardBodyContentLabelBar.Type.Item",
      "_Name": "CA_EHL_1a",
      "Text": "Negative",
      "Image": "sap-icon://warning",
      "ImagePosition": "Trailing",
      "Styles": {
        "Image": "card-font-icon-1",
        "Text": "card-label-1"
      }
    },
    {
      "_Type": "CardBodyContentLabelBar.Type.Item",
      "_Name": "CA_EHL_2a",
      "Text": "Critical",
      "Styles": {
        "Text": "card-counter-text-2"
      }
    }
  ];
}
