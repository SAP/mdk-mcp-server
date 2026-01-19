export default function SetMaxAttachments(context) {
  let displayValue = context.getValue()[0]["DisplayValue"]
  let numberDisplayValue = 0
  if(displayValue !== "No Limit"){
    numberDisplayValue = Number(displayValue);
  }
  let attachment = context.getParent().getControl('attachment_maxed');
  attachment.setMaxAttachments(numberDisplayValue);
}
  