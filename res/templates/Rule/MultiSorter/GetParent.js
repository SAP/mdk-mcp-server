/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetParent(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    alert(multiSorterProxy.getParent().getType());
}