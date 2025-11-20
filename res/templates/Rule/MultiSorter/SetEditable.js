/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetEditable(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    let editable = multiSorterProxy.getEditable();
    multiSorterProxy.setEditable(!editable);
    multiSorterProxy.redraw();
}