export default function TenSecondRule() {
  let promise = new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 10 * 1000);
  });
  return promise;
}
