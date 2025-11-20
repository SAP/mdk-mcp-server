export default function SetErrorArchiveDetailMessage(pageProxy) {
    var bindingObject = pageProxy.getBindingObject();
    var message = bindingObject["Message"];
    if (message.charAt(0) === "{") {
        message = message.substring(1, message.length - 1);
    }

    // set message to Message control
    var Message = pageProxy.evaluateTargetPath('#Page:Confirmation/#Control:Message');
    Message.setValue(message);

    var requestBody = bindingObject["RequestBody"];
    if (requestBody.charAt(0) === "{") {
        requestBody = requestBody.substring(1, requestBody.length - 1);
    }

    // set requestBody to RequestBody control
    var RequestBody = pageProxy.evaluateTargetPath('#Page:Confirmation/#Control:RequestBody');
    RequestBody.setValue(requestBody);

}