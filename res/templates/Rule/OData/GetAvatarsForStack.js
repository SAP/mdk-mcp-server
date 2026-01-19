export default function GetAvatarsForStack(context) {
  var ImagePath = '/MDKDevApp/Images/ImageForBindingCollection/';
  let operationNo = context.evaluateTargetPath("#Property:OperationNo");
  let orderId = context.evaluateTargetPath("#Property:OrderId"); 
  ImagePath = ImagePath + orderId + operationNo + 'AvatarStack.png';
  return ImagePath;
}