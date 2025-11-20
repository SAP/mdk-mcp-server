// export option #1 using default es6 syntax
global.isCustomScan = true;
export default function CustomScan(context) {
  global.isCustomScan = context.getValue();
}
