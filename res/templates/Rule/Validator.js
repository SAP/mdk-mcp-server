import validator from 'validator';

export default function Validator(controlProxy) {
  let email = 'foo@bar.com';
  let result = email + ' is email: ' + validator.isEmail(email);
  email = 'dummy.com';
  result += '\n' + email + ' is email: ' + validator.isEmail(email);

  alert(result);
}
