export default function TwoSecondRule() {
  let promise = new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
  return promise;
}
  