export default function FiveSecondRule(context) {
  let promise = new Promise(resolve => {
    setTimeout(() => {
      return context.executeAction('/MDKDevApp/Actions/NavToControlExamples.action').then(() => {
        return resolve();
      })
    }, 5 * 1000);
  });
  return promise;
}
