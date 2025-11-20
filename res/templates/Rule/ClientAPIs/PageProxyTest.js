export default function PageProxyTest(context) {
  const pageProxy = context.getPageProxy();
  alert(pageProxy === context);
}