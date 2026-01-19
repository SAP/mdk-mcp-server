
export default function SetPageAndBarsStyle(controlProxy) {

  // Style the entire Page
  controlProxy.getPageProxy().setStyle('custom-page');

  // Style the ActionBar
  controlProxy.getPageProxy().setStyle('custom-bar', 'ActionBar');
  
  // Style the ToolBar
  controlProxy.getPageProxy().setStyle('custom-bar', 'ToolBar');
}
