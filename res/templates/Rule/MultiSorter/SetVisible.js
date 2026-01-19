/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetVisible(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    let visible = multiSorterProxy.getVisible()
    if (visible === undefined) {
        visible = true;
    }
    multiSorterProxy.setVisible(!visible);
    multiSorterProxy.redraw();
}