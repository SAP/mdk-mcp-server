
export default function ChangeUserPasscode(controlProxy) {
    if (controlProxy.getPasscodeSource() === 2) {
        return controlProxy.executeAction('/MDKDevApp/Actions/DisplayPasscodeSource.action');
    } else {
        return controlProxy.executeAction('/MDKDevApp/Actions/ChangeUserPasscode.action');
    }
}
