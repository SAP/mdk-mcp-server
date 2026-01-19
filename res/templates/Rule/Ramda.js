import * as ramda from 'ramda';

export default function Ramda(controlProxy) {
  const double = x => x * 2;

  let arr = [1, 2, 3];
  let result = arr.join(',');
  arr = ramda.map(double, arr);
  result += '\nAfter double:\n' + arr.join(',');

  alert(result);
}
