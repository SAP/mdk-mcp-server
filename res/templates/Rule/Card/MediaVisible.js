export default function MediaVisible(clientAPI) {
    try {
        if (clientAPI.binding) {
            let orderIdString = clientAPI.binding.OrderId;
            let orderIdSubstring = orderIdString.substr(orderIdString.length - 3, 3);
            let orderIdInt = parseInt(orderIdSubstring);
            if (orderIdInt % 2 == 0) {
                return true;
            } else {
                return false;
            }
        }
    } catch(e) {
        console.log(e);
    }
    return true;
}
