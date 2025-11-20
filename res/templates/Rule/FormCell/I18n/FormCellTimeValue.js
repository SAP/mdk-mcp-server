import libCom from '../../../Rules/Common/Library/CommonLibrary';

export default function FormCellTimeValue(context) {
  return context.formatTime("2017-12-25T11:40:00Z", "zh-CN", "Asia/Shanghai");
}
