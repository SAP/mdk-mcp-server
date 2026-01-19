export default function ActivityItemsWithBinding(context) {
    let orderId = context.evaluateTargetPath("#Property:OrderId");

    let activityItems = [];

    activityItems.push({
        ActivityType: 'VideoCall',
        ActivityValue: "630-667-7983"
    });

    activityItems.push({
        "ActivityType": "Email",
        "ActivityValue": "pathik.chitania@sap.com"
    });

    activityItems.push({
        ActivityType: 'Detail',
        ActivityValue: orderId
    });

    return activityItems;
}