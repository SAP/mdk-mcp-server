export default function SetToolbarItemValue(controlProxy) {
  var toolbarItems = controlProxy.getToolbarControls();
  var imageOn = '/MDKDevApp/Images/on.png';
  var imageOff = '/MDKDevApp/Images/off.png';
  var imageOnText = 'AddedAsFavorite';
  var imageOffText = 'RemovedFromFavorite';
  var newValue, newText;
  toolbarItems.forEach(function (element) {
    if (element.name == controlProxy.getName()) {
      if (element.name == 'DynamicItemImage') {
        newText = imageOnText;
        newValue = imageOn;

        // currently using caption to be the flag to determine which image to be used. 
        // image value cannot be used as it would be resolved into Base64 value when get.
        if (element.caption == imageOnText) {
          newText = imageOffText;
          newValue = imageOff;
        }
        element.setCaption(newText);
        element.setImage(newValue);
        return controlProxy.executeAction('/MDKDevApp/Actions/Toast/' + newText + '.action');
      } else if (element.name == 'DynamicItemWidth') {
        newValue = 50;
        if (element.width && element.width < 200) {
          newValue = element.width + 50;
        }
        element.setCaption('Width:' + newValue.toString());
        return element.setWidth(newValue);
      }
    }
  });
}