function waitTwoSecs() {
  let promise = new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3 * 1000);
  });
  return promise;
}

export default function UpdateBannerRule(clientAPI) {

  let bannerMessageUpdater = (step) => {
    return waitTwoSecs().then(() => {
      const totalSteps = 5;
      if (step > totalSteps) {
        return Promise.resolve();
      } else {
        clientAPI.updateProgressBanner(`Step ${step}/${totalSteps}`);
        return bannerMessageUpdater(step + 1);
      }
    });
  }

  return bannerMessageUpdater(1);
}
