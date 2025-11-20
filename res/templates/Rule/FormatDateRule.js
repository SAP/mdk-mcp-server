export default function FormatDateRule(controlProxy) {
  // In controls page, we can see the control now shows the new value.
    var currDay = controlProxy.getValue().getDate();
    // Note: the date control in Controls.page has date value = 20150505100000. (May 5 2015 10AM UTC) so Day is 5.
    let aDay = new Date(2015,5,5,10).getDate();  // Sets this object to May 4 2015 10AM UTC so Day is 4.
    if(currDay == aDay) { // if the "day" is "5" --> change the date.
      // The control matches the date we want. Change it!
      return '20101010100000';
    }
    return controlProxy.getValue();
}
