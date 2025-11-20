var nsToast = require('@triniwiz/nativescript-toasty');

export default function ShowToast(controlProxy) {
  new nsToast.Toasty({ text: 'This is NS plugin Toast control' })
  .setToastDuration(nsToast.ToastDuration.LONG)
  .setToastPosition(nsToast.ToastPosition.BOTTOM)
  .setTextColor("#8B0000")
  .setBackgroundColor('#ff9999')
  .show();
}
