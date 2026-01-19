/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function HandleInvalidTheme(context) {
    var err =  context.getActionResult('_setTheme');
    let message = err.data;
    let title = 'SetTheme Action Failed';
    context.getPageProxy().setActionBinding({'errorMessage':title+':'+message});
    return context.getPageProxy().executeAction('/MDKDevApp/Actions/GenericError.action');
}
