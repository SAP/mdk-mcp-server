export default function ActionParametersIsModal(context) {
  let innerMessage = context.evaluateTargetPath("#ActionParameters/InnerMessage");
  console.log("InnerMessage: " + innerMessage);

  let isModal = context.evaluateTargetPath("#ActionParameters/InnerModal");
  return isModal;
}
