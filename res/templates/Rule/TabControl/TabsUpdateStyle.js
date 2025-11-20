// export option #1 using default es6 syntax
export default function TabsUpdateStyle(clientAPI) {
  let bottomNav = clientAPI.getPageProxy().getControl("TabsControl");
  return bottomNav.setStyle('TabsStyle', 'TabStrip');
}