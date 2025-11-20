export default function FormCellViaRule(pageProxy) {
  pageProxy.setCaption('FormCell Via Rule Page');
  let containerProxy = pageProxy.getControl('FormCellContainer');
  if (!containerProxy.isContainer()) {
    return;
  }
  containerProxy.getControls().forEach(formcellProxy => {
    switch (formcellProxy.getName()) {
      case 'NoteFormCell':
      case 'SimplePropertyFormCell':
      case 'TitleFormCell':
        formcellProxy.setValue('value via rule');
        break;
      case 'SegmentedFormCell':
        formcellProxy.setValue('High');
        break;
      case 'SegmentedFormCell2':
        formcellProxy.setValue('Low');
        break;
      case 'SwitchFormCell':
        formcellProxy.setValue(true);
        break;
      case 'ListPickerFormCellSingle':
        formcellProxy.setValue("Two"); //4000251
        break;
      case 'ListPickerFormCellMultiple':
        formcellProxy.setValue(['Two', 'Three']);
        break;
      case 'FilterFormCellSingle':
        formcellProxy.setValue('Plasma');
        break;
      case 'FilterFormCellMultiple':
        formcellProxy.setValue(['Plasma', 'Gas']);
        break;
      case 'DurationFormCell':
        formcellProxy.setValue(59);
        break;
    }
  });
}
