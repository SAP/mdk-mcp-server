/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetType(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    alert(multiSorterProxy.getType());
}