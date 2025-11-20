export default function GetDynamicImage(context) {
    let randomNum = Math.floor((Math.random() * 100) + 1);
    let imageURL = 'https://picsum.photos/id/' + randomNum + '/2000';
    return imageURL;
}
