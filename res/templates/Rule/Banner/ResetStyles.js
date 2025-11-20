export default function ResetStyles(context) {
    const pageProxy = context.getPageProxy();
    const cd = pageProxy.getClientData();
    const sectionedTable = pageProxy.getControl('BannerActionStyles');
   
    const semanticControl = sectionedTable.getControl('SemanticSegmented');
    if (semanticControl) {
        semanticControl.setValue("")
    }

    const completionSemanticControl = sectionedTable.getControl('CompletionSemanticSegmented');
    if (completionSemanticControl) {
        completionSemanticControl.setValue("")
    }

    // BannerMessage
    const bannerStylesSwitch = sectionedTable.getControl('Banner')
    if (bannerStylesSwitch) {
        bannerStylesSwitch.setValue(false)
    }
    const messageTextStylesSwitch = sectionedTable.getControl('MessageText')
    if (messageTextStylesSwitch) {
        messageTextStylesSwitch.setValue(false)
    }
    const actionLabelSwitch = sectionedTable.getControl('ActionLabel')
    if (actionLabelSwitch) {
        actionLabelSwitch.setValue(false)
    }
    const dismissButtonSwitch = sectionedTable.getControl('DismissButton')
    if (dismissButtonSwitch) {
        dismissButtonSwitch.setValue(false)
    }

    // ProgressBanner
    const bannerStylesSegmented = sectionedTable.getControl('CustomBannerSegmented')
    if (bannerStylesSegmented) {
        bannerStylesSegmented.setValue("")
    }
    const messageTextStylesSegmented = sectionedTable.getControl('CustomMessageTextSegmented')
    if (messageTextStylesSegmented) {
        messageTextStylesSegmented.setValue("")
    }
    const actionLabelSegmented = sectionedTable.getControl('CustomActionLabelSegmented')
    if (actionLabelSegmented) {
        actionLabelSegmented.setValue("")
    }
    const dismissButtonSegmented = sectionedTable.getControl('CustomDismissButtonSegmented')
    if (dismissButtonSegmented) {
        dismissButtonSegmented.setValue("")
    }

    pageProxy.redraw()
  }