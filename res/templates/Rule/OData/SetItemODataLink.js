export default function SetItemODataLink(context) {
    let page = context.evaluateTargetPath('#Page:WOOperationsList');
    page.context.clientData.linkData = context.binding["@odata.editLink"];
}