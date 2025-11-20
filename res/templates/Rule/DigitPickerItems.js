export default function DigitPickerItems(context){
	var jsonResult = [];
    for(let i=1;i<=4;i++){
    	var obj = new Object();
    	obj.DisplayValue = i.toString();
    	obj.ReturnValue = i.toString();
    	jsonResult.push(obj);
    }
    return jsonResult;
}