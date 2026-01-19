export default function ChangeButtonType(controlProxy) {
  const containerProxy = controlProxy.getPageProxy().getControl('SectionedTable');
  if (!containerProxy.isContainer()) {
    return;
  }

  const buttons = [ containerProxy.getControl('PrimaryButton'), containerProxy.getControl('MDKVisibleButton') ];
  for (let button of buttons) {
    if (button.getButtonType() && (button.getButtonType() !== 'Primary')) {
      button.setButtonType('Primary');
    } else {
      button.setButtonType('Text');
    }
  }
}
