export default function GetTextValuesFromtabs(context) {
    let value = context.nativescript.appSettingsModule.getString('Tab1') + "," + 
                context.nativescript.appSettingsModule.getString('Tab2') + "," +
                context.nativescript.appSettingsModule.getString('Tab3'); 

    context.setActionBinding({
        'errorMessage': value,
    })
    context.executeAction("/MDKDevApp/Actions/GenericError.action");

    context.nativescript.appSettingsModule.setString('Tab1', "undefined");
    context.nativescript.appSettingsModule.setString('Tab2', "undefined");
    context.nativescript.appSettingsModule.setString('Tab3', "undefined")
}
