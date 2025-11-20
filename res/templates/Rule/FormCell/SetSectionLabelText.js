export default function SetSectionLabelText(context) {
  let switchProxy = context;
  let labelFormCellProxy = context.getParent().getControl('LabelFormCell2');
  let defaultText = 'Label FormCell 2 Text';
  let longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  let text = switchProxy.getValue() ? longText : defaultText;
  labelFormCellProxy.setText(text);
  labelFormCellProxy.redraw();
}