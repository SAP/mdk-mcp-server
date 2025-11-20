export default function TextTab3(context) {
    var value = (Math.floor((Math.random() * 100) + 1)).toString();
    context.nativescript.appSettingsModule.setString('Tab3', value);
    return value;
}