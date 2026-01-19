export default function ToggleFormCellCodeVisibility(context) {
    const codeEnabled = context.getValue();
    const containerProxy = context.getPageProxy().getControl('SectionedTable0');
    if (!containerProxy.isContainer()) {
      return;
    }
    containerProxy.getControls().forEach(control => {
      if (control.getName() === 'NoteCode') {
        control.visible= codeEnabled;
      }
    });
  
    let controls = containerProxy.getControls().map(control => {
      switch (control.getName()) {
        case 'FormCellTitle1':
        case 'NoteFormCell':   
          return control;
        default:
          return undefined;
      }
    });
  
    containerProxy.getControls().forEach(proxy => {
      switch (proxy.getName()) {
        case 'NoteCode':
          let code = '';
          controls.forEach(control => {
            if (control) {
              let label = control._control._props.definition.name;
              if (control._control._props.definition._data.Caption) {
                label = control._control._props.definition._data.Caption
              }
              code += ` ${label} \n ${JSON.stringify(control._control._props.definition.rawData, null, "    ")} \n\n`;
            }
          });
  
          if (codeEnabled) {
            proxy.setValue(code);
          } else {
            proxy.setValue("");
          }
          break;
      }
    });
}
