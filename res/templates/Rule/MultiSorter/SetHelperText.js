/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetHelperText(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    multiSorterProxy.setHelperText("New HelperText");
    multiSorterProxy.redraw();
}