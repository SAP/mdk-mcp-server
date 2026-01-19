export default function SetToolbarItemSystemItem(controlProxy) {
  var page = controlProxy.evaluateTargetPath('#Page:DynamicToolbarItem');
  page.getToolbar().then(function (toolbar) {
    var toolbarItems = toolbar.getToolbarItems();
    var newValue;
    toolbarItems.forEach(function (element) {
      if (element.name == "DynamicSystemItem") {
        var currentSystemItem = element.systemItem;
	        if (currentSystemItem) {
          var systemItems = ['Action', 'Add', 'Bookmarks', 'Camera', 'Cancel', 'Compose', 'Done',
          'Edit', 'FastForward', 'Pause', 'Play', 'Refresh', 'Reply', 'Rewind', 
          'Save', 'Search', 'Stop', 'Trash', 'Organize', 'Undo', 'Redo'];

          var matchedItem = systemItems.filter(item => item === currentSystemItem);
          var idxSystemItem = -1;
          if (matchedItem ? matchedItem.length > 0 : false) {
            if (matchedItem[0] !== undefined) {
              idxSystemItem = systemItems.indexOf(matchedItem[0]);
            }
          }

          if (idxSystemItem > -1) {
            if (idxSystemItem === 20) {
              newValue = systemItems[0];
            } else {
              newValue = systemItems[idxSystemItem + 1];
            }
          }
          
          if (newValue) {
            return element.setSystemItem(newValue);
          }

          return null;
        }
      }
    });
  });
}