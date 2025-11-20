export default function CheckNoteValue(context) {
  let noteVal = context.getPageProxy().getControl('FormCellContainer').getControl('LongTextNote').getValue();
  let noteev = context.getPageProxy().evaluateTargetPath('#Control:LongTextNote/#Value');
  console.log(noteVal);
  return context.getPageProxy().executeAction({
    "Name": '/MDKDevApp/Actions/Messages/Message.action',
    "Properties": {
      "Message": noteVal + '\n---\n' + noteev,
      "Title": "Note Field Value"
    }
  });
}