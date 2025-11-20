/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ChangeAppTheme(context) {
    let selectedTheme = context.getValue()[0].ReturnValue;

    try {
        context.setTheme(selectedTheme);
    } catch (error) {
        let message = error.message;
        let title = 'SetTheme Failed';
        context.getPageProxy().setActionBinding({'errorMessage':title+':'+message});
        return context.getPageProxy().executeAction('/MDKDevApp/Actions/GenericError.action');
    }
}
