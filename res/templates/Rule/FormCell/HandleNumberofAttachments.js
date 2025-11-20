export default function HandleNumberofAttachments(context) {
  
  const maxLength = 3;
  let attachments = context.getValue();
  console.log('You have ' + attachments.length + ' files');
  if (attachments.length > maxLength) {
    attachments.pop();
    context.setValue(attachments, false);
    context.redraw();
    alert('You cannot add more than ' + maxLength + ' files!');
  }
}
