export default function ToolbarRedraw(context) {
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let fioriToolbar = pageProxy.getFioriToolbar();
    if (fioriToolbar) {
      fioriToolbar.redraw();
    }
  }
}