const longestLabelText = `This is the label text that is returned by a rule. \
It is a very long text as follows: As user of the mobile application \
I want to display some text information that consists of a headline \
and multiple lines of free text so that I can read detailed instructions. \
The text itself should not be truncated. Below are two examples, the \
first one is a figma design the second one is from the onboarding flow: \
Note: We need to investigate what "Initial" means here (as it's based on NativeScript). \
It should have proxy class e.g. FormCellLabelProxy with the appropriate get/set methods for \
all the supported properties. It should follow Fiori Guideline for font-type, \
colors, padding, etc. Investigation might be needed to see how we can use \
NativeScript control inside Form Cell Section`

const text2 = "Text set via ClientAPI"

export default function SetLabelText(context) {
    let formCellContainerProxy = context.getParent();
    let labelFormCellProxy = formCellContainerProxy.getControl('LabelFormCell');

    let currentText = labelFormCellProxy.getText();
    var setText = text2;
    if (currentText == longestLabelText) {
      setText = text2;
    } else {
      setText = longestLabelText
    }
    let alertMessage = "set label text to: " + setText;
    labelFormCellProxy.setText(setText);
    alert(alertMessage);
  }