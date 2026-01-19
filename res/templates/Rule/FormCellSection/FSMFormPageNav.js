export default async function FSMFormPageNav(clientAPI) {
  let page = clientAPI.getPageProxy().getPageDefinition('/MDKDevApp/Pages/FormCellSection/SingleForm.page');
  page.Controls[0].Sections.push({
    '_Type': 'Section.Type.FormCell',
    '_Name': 'SectionChapterPicker',
    'Controls': [{
      "_Type": "Control.Type.FormCell.ListPicker",
      "_Name": "ListPicker",
      "Caption": "Choose Single",
      "Value": "28",
      "PickerItems": {
        "DisplayValue": "{OrderDescription}",
        "ReturnValue": "{OrderId}",
        "Target": {
          "EntitySet": "MyWorkOrderHeaders",
          "Service": "/MDKDevApp/Services/Amw.service"
        }
      },
      "Search": {
        "Enabled": false,
        "Placeholder": "Item Search",
        "BarcodeScanner": false,
        "MinimumCharacterThreshold": 2
      },
      "IsSearchCancelledAfterSelection": true,
      "AllowMultipleSelection": false,
      "IsSelectedSectionEnabled": true,
      "AllowEmptySelection": false,
      "PickerPrompt": "Please Select",
      "IsPickerDismissedOnSelection": false
    }],
  });

  page.Controls[0].Sections.push({
    '_Type': 'Section.Type.FormCell',
    'Controls': [],
  });

  let sectionsLength = page.Controls[0].Sections.length;

  page.Controls[0].Sections[sectionsLength - 1].Controls.push({
    '_Type': 'Control.Type.FormCell.DatePicker',
    '_Name': 'DatePicker1',
    'Caption': 'DateTime Picker',
    'Value': "2016-12-25T11:40:00Z",
    'Mode': "datetime",
    'IsEditable': true,
    'IsVisible': true
  });

  page.Controls[0].Sections[sectionsLength - 1].Controls.push({
    'Caption': 'Test SimpleProperty',
    'PlaceHolder': '',
    'IsEditable': true,
    'Value': 'vvv',
    '_Name': 'SimpleProperty1',
    '_Type': 'Control.Type.FormCell.SimpleProperty',
    'KeyboardType': 'Number',
    'IsVisible': true
  });

  return clientAPI.executeAction({
    'Name': '/MDKDevApp/Actions/Navigation/NavAction.action',
    'Properties': {
      'PageMetadata': page,
      'PageToOpen': '/MDKDevApp/Pages/Empty.page',
      'ClearHistory': false,
      'Transition': {
        'Name': 'None',
      },
    },
    'Type': 'Action.Type.Navigation',
  });
}
