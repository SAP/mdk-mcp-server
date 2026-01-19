export default function FormatRuleWithGlobal(clientAPI) {
    let globalDefinition = clientAPI.getGlobalDefinition('/MDKDevApp/Globals/ThirdTest.global');
    if (globalDefinition.getType() == 'string') {
        return globalDefinition.getValue();
    }

    return 'Invalid global type';
}
