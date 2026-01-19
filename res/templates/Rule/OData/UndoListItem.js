export default function UndoListItem(context) {
    if (context.getClientData().linkData) {
        context.executeAction('/MDKDevApp/Actions/OData/UndoWOOperationInList.action');
    } else {
        alert('No undo entity found');
    }
}