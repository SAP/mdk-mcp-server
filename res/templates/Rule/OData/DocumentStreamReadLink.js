import DocumentActionBinding from './DocumentActionBinding';
export default function DocumentStreamReadLink(pageProxy) {
    let actionBinding = DocumentActionBinding(pageProxy);
    return actionBinding['@odata.readLink'];
}
