/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetHelperText(clientAPI) {
    const multiSorterProxy = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('MultiSorter');
    alert(multiSorterProxy.getHelperText());
}