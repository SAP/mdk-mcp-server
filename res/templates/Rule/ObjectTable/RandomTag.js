export default function RandomTag(sectionedTableProxy) {
  // generate a random number between 0 and 1
  let returnTag = Math.floor(Math.random() * 2);
  // if truthy value return another tag
  if (!!returnTag) {
    return "103-Repair";
  }

  return undefined;
}