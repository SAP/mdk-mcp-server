export default function FormatRule(controlProxy) {
  // In controls page, we can see the control now shows the new value.
  // Similarly, other controls can have their own format rules.
  let v = controlProxy.getValue();
  if (v === 'This is not valid') {
    return 'Control value set by a format rule';
    // NOTE: we can also do this. So leaving this in as an example.
    // return new Promise((resolve, reject) => {
    //   resolve('Control value set by a format rule');
    // });
  }
  return v;
}
