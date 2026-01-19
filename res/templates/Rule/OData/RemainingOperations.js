export default function RemainingOperations(controlProxy) {
  const operations = controlProxy.getBindingObject();
  if (operations) {
    return operations.length;
  }

  return 0;
}
