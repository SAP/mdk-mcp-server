export default function GetCircularImage(context) {
    const pageProxy = context.getPageProxy();
    return pageProxy.getDefinitionValue('/MDKDevApp/Images/profile2.png').then(resolvedIcon => {
        let finalImage = pageProxy.getCircularImage(resolvedIcon);
        return finalImage;
    })
}