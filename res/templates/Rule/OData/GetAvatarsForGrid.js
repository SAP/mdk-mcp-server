export default function GetAvatarsForGrid(context) {
  var ImagePath = '/MDKDevApp/Images/ImageForBindingCollection/';
  let operationNo = context.evaluateTargetPath("#Property:OperationNo");
  let orderId = context.evaluateTargetPath("#Property:OrderId"); 
  ImagePath = ImagePath + orderId + operationNo + 'AvatarGrid.png';
  return ImagePath;
}