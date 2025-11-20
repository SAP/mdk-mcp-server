import libFormat from './Common/Library/CommonLibrary';

export default function FormatNumberValue(context) {
	return libFormat.formatNumberValue(context,false,context.getName());                         
}