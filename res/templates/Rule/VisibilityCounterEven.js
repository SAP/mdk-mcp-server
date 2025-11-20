import VisibilityHelper from "./VisibilityHelper";

export default function VisibilityCounterEven(clientAPI) {
  return VisibilityHelper.getCount() % 2 === 0;
}