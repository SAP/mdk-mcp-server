export default function DocumentSize(clientAPI) {
  let sSize = '0 bytes';
  const fileSize = clientAPI.evaluateTargetPath('#Property:FileSize');

  if (fileSize) {
    sSize = `${parseInt(fileSize).toLocaleString()} bytes`;

    if (fileSize) {
      const intValue = parseInt(fileSize);
      if (intValue > (1024 * 1024 * 1024)) {
        sSize = Math.round(intValue / (1024 * 1024 * 10.24)) / 100 + ' GB';
      } else if (intValue > (1024 * 1024)) {
        sSize = Math.round(intValue / (1024 * 10.24)) / 100 + ' MB';
      } else if (intValue > 1024) {
        sSize = Math.round(intValue / 10.24) / 100 + ' KB';
      }
    }
  }
  
  return sSize;
}