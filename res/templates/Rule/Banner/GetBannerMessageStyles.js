export default function GetBannerMessageStyles(context) {
    const pageProxy = context.getPageProxy();
    let cd = pageProxy.getClientData();
    return cd.Styles ?? {};
}
