export default function GetBannerSemantic(context) {
    const pageProxy = context.getPageProxy();
    let cd = pageProxy.getClientData();
    return cd.Semantic ?? '';
}
