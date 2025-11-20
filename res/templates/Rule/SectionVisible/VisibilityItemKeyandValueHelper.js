class VisibilityItemKeyandValueHelper {
    static getCount() {
      return VisibilityItemKeyandValueHelper.count;
    }
    static incrementCount() {
        VisibilityItemKeyandValueHelper.count++;
    }
    static setBoolVal(value){
        VisibilityItemKeyandValueHelper.boolVal = value;
      console.log(VisibilityItemKeyandValueHelper.boolVal.toString());
    }
    static getBoolVal(){
      console.log(`getting this vis value: ${VisibilityItemKeyandValueHelper.boolVal}`);
      return VisibilityItemKeyandValueHelper.boolVal;
    }
  
  }
  VisibilityItemKeyandValueHelper.boolVal = true;
  VisibilityItemKeyandValueHelper.count = 0;
  export default VisibilityItemKeyandValueHelper;