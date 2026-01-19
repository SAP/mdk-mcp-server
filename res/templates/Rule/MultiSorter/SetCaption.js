/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetCaption(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    multiSorterProxy.setCaption("New Sort Caption");
    multiSorterProxy.redraw();
}