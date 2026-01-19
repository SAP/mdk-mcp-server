export default function CardOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  let detailImageValue = '/MDKDevApp/Images/ImageCollection/user4.png';
  let actionButtonIconValue = 'sap-icon://share';
  let actionButtonOnPressValue = '/MDKDevApp/Rules/Card/ShowToastMessage.js';
  let footerButtonSemanticNegativeValue = 'Negative';
  
  if (pageProxy) {
    let pageClientData = pageProxy.getClientData();
    
    let newValue;
    switch(controlName) {
      case 'MediaVisibleSwitch':
      case 'HeaderTitleOnMediaSwitch':
      case 'HeaderDetailImageIsCircularSwitch':
      case 'FooterVisibleSwitch':
      case 'FooterSecondaryActionVisibleSwitch':
      case 'FooterPrimaryActionEnabledSwitch':
      case 'HeaderActionButtonOverflowItemAction2VisibleSwitch':
      case 'HeaderExtendedHeaderItemSeparatorSwitch':
      case 'BodyVisibleSwitch':
      case 'BodyHeaderSeparatorSwitch':
      case 'BodySeparatorsSwitch':
      case 'BodyFooterSeparatorSwitch':
      case 'BodyContentLabelBarItemSeparatorSwitch':
      case 'BodyContentLabelBarLayoutSegmented':
      case 'BodyContentTextNumberOfLinesSegmented':
      case 'BodyContentSpaceNumberOfSpacingsSegmented':
        // controlProxy = sectionedTableProxy.getControl('MediaVisibleSwitch');
        
        // prevValue = testPageClientData.MediaVisible;
        // newValue = context.getValue();
        // testPageClientData.MediaVisible = newValue;
        // testPageSectionProxy.redraw();
        // alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
        break;
      case 'HeaderDetailImageSwitch':
        // prevValue = testPageClientData.HeaderDetailImage;
        newValue = context.getValue();
        if (newValue === true) {
          pageClientData.HeaderDetailImage = detailImageValue;
        } else {
          pageClientData.HeaderDetailImage = '';
        }
        // testPageSectionProxy.redraw();
        break;
      case 'HeaderActionButtonIconSwitch':
        newValue = context.getValue();
        if (newValue === true) {
          pageClientData.HeaderActionButtonIcon = actionButtonIconValue;
        } else {
          pageClientData.HeaderActionButtonIcon = '';
        }
        // testPageSectionProxy.redraw();
        break;
      case 'HeaderActionButtonOnPressSwitch':
        newValue = context.getValue();
        if (newValue === true) {
          pageClientData.HeaderActionButtonOnPress = actionButtonOnPressValue;
        } else {
          pageClientData.HeaderActionButtonOnPress = '';
        }
        // testPageSectionProxy.redraw();
        break;
      case 'HeaderActionButtonOverflowItemsSwitch':
        newValue = context.getValue();
        pageClientData.HeaderActionButtonOverflowItems = newValue
        // testPageSectionProxy.redraw();
        break;
      case 'HeaderExtendedHeadersSwitch':
        newValue = context.getValue();
        pageClientData.HeaderExtendedHeaders = newValue
        // testPageSectionProxy.redraw();
        break;
      case 'HeaderExtendedHeadersSegmented':
        newValue = context.getValue() && context.getValue().length > 0 ? context.getValue()[0] ?  context.getValue()[0].ReturnValue : '' : '';
        pageClientData.HeaderExtendedHeaders = newValue
        // testPageSectionProxy.redraw();
        break;
      case 'FooterButtonSemanticNegativeSwitch':
        newValue = context.getValue();
        if (newValue === true) {
          pageClientData.FooterButtonSemantic = footerButtonSemanticNegativeValue;
        } else {
          pageClientData.FooterButtonSemantic = '';
        }
        // testPageSectionProxy.redraw();
        break;
      default:
          break;
    }

    if (context.nativescript.platformModule.device.deviceType === 'Tablet') {
      // only can display flex column pages on tablet
      let testPageProxy = context.evaluateTargetPathForAPI('#Page:StaticCardTest');
      if (testPageProxy) {
        let testPageSectionedTableProxy = testPageProxy.getControl('CardTestSectionedTable');
        if (testPageSectionedTableProxy) {
          let testPageSectionProxy = testPageSectionedTableProxy.getSection('CardTestSection');
          if (testPageSectionProxy) {
            testPageSectionProxy.redraw();
          }
        }
      }
    } else {
      let testControlAutoShowModalSwitchValue = pageProxy.evaluateTargetPath('#Control:AutoShowModalSectionSwitch/#Value');
      if (testControlAutoShowModalSwitchValue === true) {
        // for phone will show the card page as modal
        pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToModalStaticCardTest.action');
      }
    }
  }
}