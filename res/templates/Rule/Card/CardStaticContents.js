export default function CardStaticContents(clientAPI) {
  return  [
    {
      "_Type": "CardBodyContent.Type.Text",
      "Text": "abcde",
      "NumberOfLines": 2,
      "Styles": {
        "Text": "card-label-2"
      }
    },
    {
      "_Type": "CardBodyContent.Type.LabelBar",
      "Layout": {
        "LayoutType": "Horizontal"
      },
      "ItemSeparator": true,
      "Items": [
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
      ]
    },
    {
      "_Type": "CardBodyContent.Type.Space",
      "NumberOfSpacings": 3
    },
    {
      "_Type": "CardBodyContent.Type.Separator",
      "Style": "card-label-2"
    }
  ];
}
