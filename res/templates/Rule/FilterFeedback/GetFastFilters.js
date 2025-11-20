export default function GetFastFilters(context) {
  return [
    {  
      "_Name": "OrderByOrderId",
      "FilterType": "Sorter",
      "Label": "Order By",
      "DisplayValue": "Order Id",
      "ReturnValue": "OrderId"
    },
    {  
      "_Name": "OrderByBA",
      "FilterType": "Sorter",
      "DisplayValue": "Business Area",
      "ReturnValue": "BusinessArea"
    },
    {  
      "_Name": "LowPriority",
      "FilterType": "Filter",
      "Label": "Prio",
      "FilterProperty": "/MDKDevApp/Globals/Priority.global",
      "DisplayValue": "Low",
      "ReturnValue": "1"
    },
    {  
      "_Name": "MedPriority",
      "FilterType": "Filter",
      "FilterProperty": "/MDKDevApp/Globals/Priority.global",
      "DisplayValue": "Medium",
      "ReturnValue": "2"
    },
    {  
      "_Name": "HE217",
      "FilterType": "Filter",
      "FilterProperty": "HeaderEquipment",
      "Label": "HE",
      "DisplayValue": "HE-10000217",
      "ReturnValue": "10000217"
    },
    {  
      "_Name": "IDFilterLt",
      "FilterType": "Filter",
      "FilterProperty": "",
      "CustomQueryGroup":"OrderIdGroup",
      "Label": "ID",
      "DisplayValue": "< 4000020",
      "ReturnValue": "OrderId lt '4000020'"
    },
    {  
      "_Name": "IDFilterGt",
      "FilterType": "Filter",
      "FilterProperty": "",
      "CustomQueryGroup":"OrderIdGroup",
      "Label": "",
      "DisplayValue": "> 4000020",
      "ReturnValue": "OrderId gt '4000020'"
    }
  ];
}
