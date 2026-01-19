export default function ShowIndicatorFor3Minutes(proxy) {
  // Show multiple activity indicators to test behavior with passcode.
  proxy.showActivityIndicator('Showing for 3 minutes');
  setTimeout(() => {
    proxy.dismissActivityIndicator();
  }, 60 * 3 * 1000);
}
