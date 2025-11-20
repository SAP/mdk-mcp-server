// export option #1 using default es6 syntax
export default function ChangeStripType(clientAPI) {
  let tabControl = clientAPI.getPageProxy().getControl("TabsControl");
  return tabControl.setTabStripType(tabControl.getTabStripType() === 'Segmented' ? 'Normal' : 'Segmented');
}