// export option #1 using default es6 syntax
export default function TabItems() {
  
  let items = [
    {
      "_Name": "ActionsTab",
      "Caption": "Actions",
      "Image": "font://&#xe05a;",
      "OnPress": "$(PLT,'/MDKDevApp/Actions/Messages/OnPressIOS.action', '/MDKDevApp/Actions/Messages/OnPressAndroid.action')",
      "PageToOpen" : "/MDKDevApp/Pages/Examples/TabActionExamples.page",
      "_Type": "Control.Type.TabItem"
    },
    {
      "_Name": "ControlsTab",
      "Caption": "/MDKDevApp/Rules/ControlsCaption.js",
      "Image": "res://map_icon",
      "ResetIfPressedWhenActive": "/MDKDevApp/Rules/AlwaysTrue.js",
      "OnPress":"/MDKDevApp/Rules/TabControl/TabControlRule.js",
      "PageToOpen" : "/MDKDevApp/Pages/Examples/ControlExamples.page",
      "_Type": "Control.Type.TabItem"
    },
    {
      "_Name": "OData",
      "Caption": "OData",
      "ResetIfPressedWhenActive": "/MDKDevApp/Rules/AlwaysTrue.js",
      "PageToOpen" : "/MDKDevApp/Pages/Examples/ODataExamples.page",
      "_Type": "Control.Type.TabItem"
    }
  ];

  return items;
}