export default function UpdateSemantic(context) {
    const value = context.getValue();
    const cd = context.getPageProxy().getClientData();
    const name = context.getName();
    switch (name) {
        case "SemanticSegmented":
            if (value && value.length) {
                cd.Semantic = value[0].ReturnValue;
            } else {
                cd.Semantic = "";
            }
            break;
        case "CompletionSemanticSegmented":
            if (value && value.length) {
                cd.CompletionSemantic = value[0].ReturnValue;
            } else {
                cd.CompletionSemantic = "";
            }
            break;
    }
}
