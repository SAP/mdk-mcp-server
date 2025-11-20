export default function ShowIndicatorAndDoAction(proxy) {
  // Do a chain of actions when the activity indicator is already shown.
  const id1 = proxy.showActivityIndicator('Item 1');
  let id2;
  let id3;
  setTimeout(() => {
    id2 = proxy.showActivityIndicator('Item 2 - This should only be shown once');
  }, 2000);
  setTimeout(() => {
    // Start the actions
    const actionPromise = proxy.executeAction('/MDKDevApp/Actions/ActivityIndicator/ChainOfActions.action');
    setTimeout(() => {
      // Dismiss an indicator while the action is in progress.
      // This should dismiss id2, not anything shown by the actions.
      proxy.dismissActivityIndicator();
    }, 1000);
    actionPromise.then(() => {
      // When the promise completes, let Item 1 show then dismiss it.
      setTimeout(() => {
        proxy.dismissActivityIndicator();
      }, 2000);
    })
  }, 4000);
}
