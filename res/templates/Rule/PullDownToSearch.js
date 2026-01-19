export default function PullDownToSearch(context) {
  let sectionTableProxy = context.getControl('SectionedTable');
  sectionTableProxy.searchString = 'search string';
}
