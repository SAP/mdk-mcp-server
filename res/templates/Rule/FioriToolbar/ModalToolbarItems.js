export default function ModalToolbarItems(context) {
  let page = context.getPageProxy().evaluateTargetPath('#Page:FioriToolbarExamples');
  if (page) {
    let scenario = page.context.clientData.Scenario;
    switch (scenario) {
      case '1':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "icon1",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }
        ];
      case '2':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button2",
            "Title": "Button 1",
            "ButtonType": "Primary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '3':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "icona",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }, {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "iconb",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }
        ];
      case '4':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button4",
            "Title": "Button 4",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "icon4",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }
        ];
      case '5':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button4",
            "Title": "Button 4",
            "ButtonType": "Primary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "icon4",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }
        ];
      case '6':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button4",
            "Title": "Button 4",
            "ButtonType": "Secondary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "icon4",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }
        ];
      case '7':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button6a",
            "Title": "Button 6a",
            "Semantic": "Normal",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button6b",
            "Title": "Button 6b",
            "Semantic": "Negative",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '8':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7a",
            "Title": "Button 7a",
            "ButtonType": "Primary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7b",
            "Title": "Button 7b",
            "ButtonType": "Secondary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '9':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button8a",
            "Title": "Button 8a",
            "ButtonType": "Primary",
            "Semantic": "Normal",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button8b",
            "Title": "Button 8b",
            "ButtonType": "Secondary",
            "Semantic": "Normal",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '10':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button9a",
            "Title": "Button 9a",
            "ButtonType": "Primary",
            "Semantic": "Negative",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button9b",
            "Title": "Button 9b",
            "ButtonType": "Secondary",
            "Semantic": "Negative",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '11':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button10a",
            "Title": "Button 10a",
            "Image": "/MDKDevApp/Images/extension.png",
            "ImagePosition": "Leading",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button10b",
            "Title": "Button 10b",
            "Image": "/MDKDevApp/Images/extension.png",
            "ImagePosition": "Trailing",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '12':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button11a",
            "Title": "Button 11a",
            "ButtonType": "Primary",
            "Image": "sap-icon://customer-and-supplier",
            "ImagePosition": "Leading",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button11b",
            "Title": "Button 11b",
            "ButtonType": "Secondary",
            "Image": "sap-icon://customer-and-supplier",
            "ImagePosition": "Trailing",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '13':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button12a",
            "ButtonType": "Primary",
            "Image": "/MDKDevApp/Images/extension.png",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button12b",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '14':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7a",
            "Title": "Button 7a",
            "ButtonType": "Primary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7b",
            "Title": "Button 7b",
            "ButtonType": "Primary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '15':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7a",
            "Title": "Button 7a",
            "ButtonType": "Secondary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7b",
            "Title": "Button 7b",
            "ButtonType": "Secondary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '16':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7a",
            "Title": "Button 7a",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7b",
            "Title": "Button 7b",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '17':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button20",
            "ButtonType": "Primary",
            "Title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton2.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button21",
            "ButtonType": "Secondary",
            "Title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton2.action"
          }
        ];
      case '18':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button20",
            "Title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton2.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button21",
            "Title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton2.action"
          }
        ];
      case '19':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7a",
            "Title": "Button 7a",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7b",
            "Title": "Button 7b",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          },
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button8a",
            "Title": "Button 8a",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button8b",
            "Title": "Button 8b",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '20':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7a",
            "Title": "Button 7a",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button7b",
            "Title": "Button 7b",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          },
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button8a",
            "Title": "Button 8a",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button8b",
            "Title": "Button 8b",
            "ButtonType": "Primary",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      case '21':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "icona",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }, {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "iconb",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          },
          {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "iconc",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }, {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "icond",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          },
          {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "icone",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }, {
            "_Type": "FioriToolbarItem.Type.Icon",
            "_Name": "iconf",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageIcon.action",
            "Icon": "/MDKDevApp/Images/extension.png"
          }
        ];
      case '22':
        return [
          {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button22a",
            "Title": "Submit",
            "Image": "sap-icon://customer-and-supplier",
            "ImagePosition": "Leading",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }, {
            "_Type": "FioriToolbarItem.Type.Button",
            "_Name": "button22b",
            "Title": "Save",
            "OnPress": "/MDKDevApp/Actions/Messages/MessageButton.action"
          }
        ];
      default:
        return [];
    }
  }
}