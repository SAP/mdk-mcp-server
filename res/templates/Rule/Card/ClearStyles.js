export default function ClearStyles(context) {
    const pageProxy = context.getPageProxy();
    const sectionedTable = pageProxy.getControl('NewCardStylesSectionedTable');
    const cardSegment = sectionedTable.getControl('Card');
    if (cardSegment) {
        cardSegment.setValue("");
    }
    const mediaSegment = sectionedTable.getControl('Media');
    if (mediaSegment) {
        mediaSegment.setValue("");
    }
    const headerSegment = sectionedTable.getControl('Header');
    if (headerSegment) {
        headerSegment.setValue("");
    }
    const actionButtonSegment = sectionedTable.getControl('HeaderAction');
    if (actionButtonSegment) {
        actionButtonSegment.setValue("");
    }
    const overflowItemSegment = sectionedTable.getControl('OverflowItem');
    if (overflowItemSegment) {
        overflowItemSegment.setValue("");
    }
    const labelSegment = sectionedTable.getControl('ExtendedHeaderLabel');
    if (labelSegment) {
        labelSegment.setValue("");
    }
    const ratingSegment = sectionedTable.getControl('ExtendedHeaderRating');
    if (ratingSegment) {
        ratingSegment.setValue("");
    }
    const tagSegment = sectionedTable.getControl('ExtendedHeaderTag');
    if (tagSegment) {
        tagSegment.setValue("");
    }
    const kpiViewSegment = sectionedTable.getControl('ExtendedHeaderKpiView');
    if (kpiViewSegment) {
        kpiViewSegment.setValue("");
    }
    const footerSegment = sectionedTable.getControl('Footer');
    if (footerSegment) {
        footerSegment.setValue("");
    }
    const footerActionSegment = sectionedTable.getControl('FooterAction');
    if (footerActionSegment) {
        footerActionSegment.setValue("");
    }
}