export default function FormCellLocalizeTextValue(context) {
  let dynamicParams = ['MDK', 'NativeScript 3.x', 'XCode 9.x'];
  return context.localizeText('dynamic_localizable_value', dynamicParams);
}
