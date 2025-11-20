export default function ToolbarReset(context) {
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let fioriToolbar = pageProxy.getFioriToolbar();
    if (fioriToolbar) {
      fioriToolbar.reset();
    }
  }
}