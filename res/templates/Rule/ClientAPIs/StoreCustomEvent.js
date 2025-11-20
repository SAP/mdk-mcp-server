export default function StoreCustomEvent(context) {
    const currentDate = new Date();
    const duration = 123.123;
    let msg = "";
    try {
      context.getLogger()._storeCustomEvent('Demo App custom event end', currentDate, duration);
      msg = "done without error";
    } catch (error) {
        msg = error.message;
    }
    alert(msg);
  }