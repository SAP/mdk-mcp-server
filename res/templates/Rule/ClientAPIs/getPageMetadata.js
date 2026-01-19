export default function getPageMetadata(clientAPI) {
    let pageDef = clientAPI.getPageDefinition('/MDKDevApp/Pages/Examples/FeatureCategory.page');
    pageDef.Caption = "Caption Changed";
    return pageDef;
}
