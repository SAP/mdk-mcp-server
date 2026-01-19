export default function FormCellListPickerI18nValue(context) {
  const appLanguage = context.getLanguage();
  if (appLanguage) {
    return appLanguage;
  }
  return '';
}
