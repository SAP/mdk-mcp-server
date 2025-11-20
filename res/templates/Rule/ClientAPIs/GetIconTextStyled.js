export default function GetIconTextStyled(context) {
    const pageProxy = context.getPageProxy();
    const stylesObject = {
        FontSize: 17,
        FontColor: '#FF0000',
        BackgroundColor: '#000000',
    };
    let finalImage = pageProxy.getIconTextImage('AB', 24, 24, true, JSON.stringify(stylesObject));
    return finalImage;
}