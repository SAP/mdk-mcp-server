class VisibilityHelper {
  static getCount() {
    return VisibilityHelper.count;
  }
  static incrementCount() {
    VisibilityHelper.count++;
  }

}

VisibilityHelper.count = 0;
export default VisibilityHelper;