 export default function IsAlphaNumeric(controlProxy) {
 var currentControlValue = controlProxy.getValue();
 var regex=/^[a-zA-Z]+$/;
    if (!currentControlValue.match(regex))
    {
    //return 'Control value set by a format rule';
    // NOTE: we can also do this. So leaving this in as an example.
    currentControlValue = 'Must use alphanumeric chracters'
    console.log('Format Rule executed On FormatRule '+ ' to '+ currentControlValue);
    //return currentControlValue;
    return currentControlValue;
  }
  return controlProxy.getValue();
}
