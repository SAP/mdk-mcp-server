
export default function VerifyPasscode(controlProxy) {
    return controlProxy.executeAction({
        'Name': '/MDKDevApp/Actions/VerifyPasscode1.action',
        'Properties': {
            'OnFailure': '',
            'OnSuccess': ''
        }
    }).then(() => {
        alert('Verify success, run next step');
    }, () => {
        alert('Failure, user cancelled');
    });
}
