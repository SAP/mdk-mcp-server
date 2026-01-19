export default function SetInvalidTheme(context) {
    try {
        context.setTheme("InvalidThemeStyles");
    } catch (error) {
        let message = error.message;
        let title = 'SetTheme Failed'
        context.getPageProxy().setActionBinding({'errorMessage':title+':'+message});
        return context.getPageProxy().executeAction('/MDKDevApp/Actions/GenericError.action');
    }
}
