export default function PageMetadataObjectRule(context) {
  return {
    "Caption": "PageMetadata Object Rule Test",
    "_Type": "Page",
    "_Name": "PageMetadataObjectTest",
    "Controls": [{
      "Sections": [{
        "Header": {
          "Caption": "Actions"
        },
        "ObjectCells": [{
          "ObjectCell": {
            "AccessoryType": "disclosureIndicator",
            "Description": "another pagemetadata",
            "OnPress": "/MDKDevApp/Actions/Navigation/PageMetadataObject.action",
            "Title": "Next Page"
          }
        }, {
          "ObjectCell": {
            "AccessoryType": "disclosureIndicator",
            "Description": "another pagemetadata",
            "OnPress": "/MDKDevApp/Actions/Navigation/PageMetadataObjectRule.action",
            "Title": "Next Page (Rule)"
          }
        }],
        "_Name": "NavigationActionSection",
        "_Type": "Section.Type.ObjectTable"
      }],
      "_Type": "Control.Type.SectionedTable",
      "_Name": "NavigationActionSectionTable"
    }]
  };
}
