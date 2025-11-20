export default function SectionRedraw(clientAPI) {
    let sectionedTableProxy = clientAPI.getPageProxy().getControl('SectionedTable0');
    if (!sectionedTableProxy) {
        return;
    }
    let sectionName = 'SectionExtension0';
    if (clientAPI.getName() === 'ButtonTableTypeButton4') {
        sectionName = 'SectionExtension1';
    }
    let extSectionProxy = sectionedTableProxy.getSection(sectionName);
    if (extSectionProxy) {
        extSectionProxy.redraw();
    }
}