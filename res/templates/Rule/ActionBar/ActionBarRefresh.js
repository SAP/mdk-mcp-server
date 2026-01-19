export default function ActionBarRefresh(context) {
  let controlName = context.getName();
  let actionBarProxy = context.getParent();
  if (actionBarProxy) {
    switch(controlName) {
      case 'RedrawButton':
        actionBarProxy.redraw();
        break;
      case 'ResetButton':
        actionBarProxy.reset();
        break;
      default:
        break;
    }
  }
}