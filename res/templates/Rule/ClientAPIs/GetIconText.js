export default function GetIconText(context) {
    const pageProxy = context.getPageProxy();
    let finalImage = pageProxy.getIconTextImage('AB', 24, 24, false);
    return finalImage;
}