import VisibilityItemKeyandValueHelper from "./VisibilityItemKeyandValueHelper";

export default function VisibilityGetBoolean(clientAPI) {
  let temp = VisibilityItemKeyandValueHelper.getBoolVal();
  console.log(`in VisGetBool: ${temp}`);
  return temp;
}