export default function GetBannerCompletionSemantic(context) {
    const pageProxy = context.getPageProxy()
    let cd = pageProxy.getClientData();
    return cd.CompletionSemantic ?? '';
}
