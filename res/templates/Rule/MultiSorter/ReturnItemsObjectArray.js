/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function ReturnItemsObjectArray(clientAPI) {
    return [
        {
            "ReturnValue": "OrderId",
            "DisplayValue": "OrderId",
            "AscendingLabel": "Lowest first",
            "DescendingLabel": "Highest first"
        },
        {
            "ReturnValue": "Priority",
            "DisplayValue": "Priority - Long text of Products be wrapped up",
            "AscendingLabel": "This is very long ascending text be wrapped up",
            "DescendingLabel": "Highest first"
        },
        {
            "ReturnValue": "HeaderFunctionLocation",
            "DisplayValue": "HeaderFunctionLocation",
            "AscendingLabel": "Ascending",
            "DescendingLabel": "Descending"
        },
        {
            "ReturnValue": "CreationDate",
            "DisplayValue": "CreationDate",
            "AscendingLabel": "Earliest first",
            "DescendingLabel": "Latest first"
        },
        {
            "ReturnValue": "DueDate",
            "DisplayValue": "DueDate",
            "AscendingLabel": "Earliest first",
            "DescendingLabel": "Latest first"
        }
    ];
}