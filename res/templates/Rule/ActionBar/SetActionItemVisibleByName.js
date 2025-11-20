export default function SetActionItemVisibleByName(controlClientAPI) {
  const visible = controlClientAPI.getValue();
  const pageAPI = controlClientAPI.getPageProxy();
  pageAPI.setActionBarItemVisible('NavigationButton', visible);
}