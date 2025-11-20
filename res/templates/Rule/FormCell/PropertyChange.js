export default function PropertyChange(controlProxy) {
  var switchControl = controlProxy.evaluateTargetPath("#Control:Switch");
  switchControl.setCaption("New Switch Caption");
  switchControl.setHelperText("New This is switch helper text");

  var noteFormCell = controlProxy.evaluateTargetPath("#Control:NoteFormCell");
  noteFormCell.setCaption("New Note Caption");
  noteFormCell.setEnable(false);

  let formCellProxy = controlProxy.getControl('FormCellContainer')
  let switchProxy = formCellProxy.getControl('Switch');
  switchProxy.setCaption("Proxy New switch Caption");
  switchProxy.setEditable(false);
  
}
