export default function GetCaption(context) {
    let randomNum = Math.floor((Math.random() * 100) + 1);
    let caption = 'Number ' + randomNum;
    return caption;
}

