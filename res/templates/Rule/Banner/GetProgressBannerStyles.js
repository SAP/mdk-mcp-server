export default function GetProgressBannerStyles(context) {
    const pageProxy = context.getPageProxy();
    let cd = pageProxy.getClientData();
    return cd.Styles ?? {};
}
