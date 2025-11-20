
export default function OnPriorityChangedSecond(context) {
	console.log('OnPriorityChangedSecond triggered');
		if (context.getValue() && context.getValue().length >= 1 &&
		context.getValue()[0] && context.getValue()[0].ReturnValue) {		
			const woFilter = "$filter=Priority eq '" + context.getValue()[0].ReturnValue + "'";
			let woListpicker = context.evaluateTargetPathForAPI("#Page:WOSelectPage/#Control:WOListPickerSecond");
			let woTargetSpecifier = woListpicker.getTargetSpecifier();
			woTargetSpecifier.setQueryOptions(woFilter);
			return woListpicker.setTargetSpecifier(woTargetSpecifier).then(() => {
					console.log('OnPriorityChangedSecond ended');
			});
		}
}
