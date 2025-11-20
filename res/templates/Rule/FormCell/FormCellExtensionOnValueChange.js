export default function FormCellExtensionOnValueChange(controlProxy) {

  var value = controlProxy.getValue();
  var simpleProperty1 = controlProxy.evaluateTargetPath('#Page:Formcell/#Control:SimpleProperty1');
  simpleProperty1.setValue(Math.round(value));
}
