export default function FormCellListPickerI18nRegionValue(context) {
  const appRegion = context.getRegion();
  if (appRegion) {
    return appRegion;
  }
  return '';
}
