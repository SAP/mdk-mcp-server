export default function RedrawCard(context) {
    const pageProxy = context.getPageProxy();
    return pageProxy.redraw();
}