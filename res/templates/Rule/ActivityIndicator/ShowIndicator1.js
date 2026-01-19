export default function ShowIndicator1(proxy) {
  // Show multiple activity indicators to make sure that
  // the behavior is correct.
  const id1 = proxy.showActivityIndicator('Item 1');
  let id2;
  let id3;
  setTimeout(() => {
    id2 = proxy.showActivityIndicator('Item 2');
  }, 2000);
  setTimeout(() => {
    id3 = proxy.showActivityIndicator('Item 3');
  }, 4000);
  setTimeout(() => {
    proxy.dismissActivityIndicator(id3);
  }, 6000);
  setTimeout(() => {
    proxy.dismissActivityIndicator(id2);
  }, 8000);
  setTimeout(() => {
    proxy.dismissActivityIndicator(id1);
  }, 10000);
}
