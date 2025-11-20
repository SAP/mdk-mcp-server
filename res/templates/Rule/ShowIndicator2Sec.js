export default function ShowIndicator2Sec(listpickerProxy) {
    const id1 = listpickerProxy.showActivityIndicator('Show Indicator 2s');
    setTimeout(() => {
        listpickerProxy.dismissActivityIndicator(id1);
    }, 2000);
}
