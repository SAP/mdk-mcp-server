export default function HeaderTags(pageProxy) {
  let clientData = pageProxy.getPageProxy().getClientData();
  if (clientData.HeaderRedraw === true) {
    return ["one", "two", "three"];
  }
  clientData.HeaderRedraw = false;
  return [];
}