export default function SectionLocalizeTitle(context) {
  // let dynamicParams = ['{OrderId}']; // this will work as well
  var orderId = context.binding.OrderId;
  return context.localizeText('dynamic_binding_localizable_value_order_id', [orderId]);
}
