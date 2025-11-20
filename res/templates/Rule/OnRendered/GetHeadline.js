export default function GetHeadline(clientAPI) {
  let page = clientAPI.getPageProxy();
  if (page) {
    let table = page.getControl('OnRenderedTable');
    if (table) {
      let formcell = table.getControl('SimplePropertyFormCell');
      if (formcell) {
        let value = formcell.getValue();
        if (value && value !== '') {
          return value;
        }
      }
    }
  }
  return 'Headline';
}