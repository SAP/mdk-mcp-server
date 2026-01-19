export default function CardDynamicContentLabelBarItem(clientAPI) {
  if (clientAPI.binding) {
    let idString = clientAPI.binding.EquipId;
    let idInt = parseInt(idString);
    if (idInt % 2 == 0) {
      return {
        "_Type": "CardBodyContentLabelBar.Type.Item",
        "_Name": "CA_EHL_1a",
        "Text": "{EquipDesc}",
        "Image": "sap-icon://warning",
        "ImagePosition": "Trailing",
        "Styles": {
          "Image": "card-font-icon-1",
          "Text": "card-label-1"
        }
      };
    } else {
      return {
        "_Type": "CardBodyContentLabelBar.Type.Item",
        "_Name": "CA_EHL_2a",
        "Text": "{EquipDesc}",
        "Styles": {
          "Text": "card-counter-text-2"
        }
      };
    }
  }
}
