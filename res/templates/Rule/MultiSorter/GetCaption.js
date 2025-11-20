/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetCaption(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    alert(multiSorterProxy.getCaption());
}