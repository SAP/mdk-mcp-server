/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function GetThemesFromTargetPath(context) {
    const availableThemes = context.evaluateTargetPath("#Application/#ClientData/#Property:AvailableThemes");
    let results = [];

    for (const key of Object.keys(availableThemes)) {
        var obj = new Object();
        obj.DisplayValue = availableThemes[key]
        obj.ReturnValue = availableThemes[key];
        results.push(obj);
    }

    return results;
}