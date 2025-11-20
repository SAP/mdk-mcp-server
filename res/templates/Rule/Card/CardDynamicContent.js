export default function CardDynamicContent(clientAPI) {
  if (clientAPI.binding) {
    let opNoString = clientAPI.binding.OperationNo;
    let opNoInt = parseInt(opNoString);
    if (opNoInt < 40) {
      return {
        "_Type": "CardBodyContent.Type.Text",
        "Text": "{OperationNo}",
        "NumberOfLines": 2,
        "Styles": {
          "Text": "card-label-2"
        }
      };
    } else {
      return {
        "_Type": "CardBodyContent.Type.LabelBar",
        "Layout": {
          "LayoutType": "Horizontal",
        },
        "ItemSeparator": true,
        "Items": [
        {
          "_Type": "CardBodyContentLabelBar.Type.Item",
          "_Name": "CA_EHL_1a",
          "Text": "{OperationShortText}",
          "Image": "sap-icon://warning",
          "ImagePosition": "Trailing",
          "Styles": {
            "Image": "card-font-icon-1",
            "Text": "card-label-1"
          }
        }]
      };
    }
  }
}
