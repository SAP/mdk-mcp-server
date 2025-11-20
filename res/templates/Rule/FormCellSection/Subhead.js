export default function Subhead(controlProxy) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('aa bb');
    }, 2000);
  });
}
