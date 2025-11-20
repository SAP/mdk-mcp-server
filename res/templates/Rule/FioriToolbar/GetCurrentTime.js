export default function GetCurrentTime(controlProxy) {
    let proxy = controlProxy.getDataSubscriptions();
    let dateObject = new Date()
    let date = dateObject.toISOString().slice(11, -5)
    return date
  }