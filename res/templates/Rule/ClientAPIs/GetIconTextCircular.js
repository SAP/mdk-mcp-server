export default function GetIconTextCircular(context) {
    const pageProxy = context.getPageProxy();
    let finalImage = pageProxy.getIconTextImage('AB', 24, 24, true);
    return finalImage;
}