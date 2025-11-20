import _ from 'underscore';

export default function Underscore(controlProxy) {
  let stooges = [{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, { name: 'curly', age: 60 }];
  let result = _.pluck(stooges, 'name').join(",");
  stooges = _.sortBy(stooges, 'name');
  result += '\nAfter sort:\n' + _.pluck(stooges, 'name').join(',');

  alert(result);
}
