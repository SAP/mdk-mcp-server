export default function ObjectHeaderUpdateBinding(pageProxy) {
  let controlProxy = pageProxy.getControl("ObjectHeaderSection");
  let binding = controlProxy.getBindingObject();
  binding.Tags = [
    "Tag5",
    "Tag6",
    "Tag7"
  ];
  controlProxy.redraw();
}
