export default function Redraw(controlProxy) {
  const pageProxy = controlProxy.getPageProxy();
  if (pageProxy) {
    pageProxy.redraw();
  }
}
