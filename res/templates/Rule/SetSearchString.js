export default function SetSearchString(context) {
    let sectionTableProxy = context.getControl('SectionedTable');
    sectionTableProxy.searchString = '0026';
}