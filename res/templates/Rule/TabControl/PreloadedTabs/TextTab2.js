export default function TextTab2(context) {
    var value = (Math.floor((Math.random() * 100) + 1)).toString();
    context.nativescript.appSettingsModule.setString('Tab2', value);
    return value;
}
