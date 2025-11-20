export default function FormCellViaRuleSeam1899(pageProxy) {
  pageProxy.setCaption('FormCell Via Rule Page Seam1899');
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
      case 'SegmentedControlMic975_2':
        formcellProxy.setValue('High');
        break; 
      case 'SegmentedControlMic1899':
        formcellProxy.setValue('4000189');
        break;  
      case 'SegmentedControlMic131':
        formcellProxy.setValue('4000189');
        break; 
      case 'SegmentedControlMicNormal1':
        formcellProxy.setValue('4000189');
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
      case 'ListPickerFormCellSingle975_2':
        formcellProxy.setValue("Three");
        break;
      case 'ListPickerFormCellSingle131':
        formcellProxy.setValue("4000189");
        break;
      case 'ListPickerFormCellSingle1899':
        formcellProxy.setValue("4000189");
        break;
      case 'ListPickerFormCellSingleNormal1':
        formcellProxy.setValue("4000189");
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
