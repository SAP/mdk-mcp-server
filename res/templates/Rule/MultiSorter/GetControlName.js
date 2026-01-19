/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetControlName(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    alert(multiSorterProxy.getName());
}