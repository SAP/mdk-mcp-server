/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function GetThemeList(context) {
    const availableThemes = context.getAvailableThemes();
    let results = [];

    for (const key of Object.keys(availableThemes)) {
        var obj = new Object();
        obj.DisplayValue = availableThemes[key];
        obj.ReturnValue = availableThemes[key];
        results.push(obj);
    }

    return results;
}
