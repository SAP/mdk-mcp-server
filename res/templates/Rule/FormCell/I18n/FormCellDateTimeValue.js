import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellDateTimeValue(context) {
  return context.formatDatetime(new Date(), "en-GB", "UTC");
}
