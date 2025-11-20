
export default function SetActionItemVisible(controlClientAPI) {
  const pageAPI = controlClientAPI.getPageProxy();
  pageAPI.setActionBarItemVisible(0, false);
}
