export default function PageProxyOnload(context) {
  const pageProxy = context.getPageProxy();
  alert(pageProxy === context);
}