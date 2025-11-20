export default function GetSAPPassportHeaderValue(controlProxy) {
	/*
	 * @param componentName Name of the initial component.
   * @param action Name of executed action.
   * @param traceFlag Trace configuration. Accepted values are: 
   * StatisticsOnly, SAPTraceLevel_SQL, SAPTraceLevel_Buffer, SAPTraceLevel_Enqueu, SAPTraceLevel_RFC, 
   * SAPTraceLevel_Permission, SAPTraceLevel_Free, SAPTraceLevel_CFunction, DSR_ABAP_Trace_Flag, 
   * SAPTraceLevel_ABAPCondens0, SAPTraceLevel_ABAPCondens1, DSR_SAT_Trace_Flag, ESP_WebService_Flag,
   * HTTP, TRCLVL_None, TRCLVL_Low, TRCLVL_Medium, TRCLVL_High
   * @param componentType Type of initial component. Accepted values are:
   * Undefined, Webas, J2EE, Trex, ICM, Gateway, CPIC, Browser, TraceLib, DotNet, Eclipse, PI_For_SAP_Sender,
   * SCP_For_NonSAP_Sender, PI_For_NonSAP_Sender, SAP_Partner, SCP_Request_Or_Determination_Later_In_Processing,
   * S4, SFSF, Ariba, Concur, Fieldglass, Callidus, BYD, IBP, Hybris, SMB_B1, Industry_Cloud, Leonardo,
   * Customer_Checkout, CoPilot
   * @param prevComponentName Optional. Name of previous component. Will use initial component name if unspecified.
   * @param userId Optional. ID of user who is processing the request.
	 */

	// without optional parameters
	let passportValue1 = controlProxy.getSAPPassportHeaderValue('MDK', 'action', 'SAPTraceLevel_Permission', 'SFSF');
	console.log('passportValue1: ' + passportValue1);

	// with prev component name
	let passportValue2 = controlProxy.getSAPPassportHeaderValue('MDK', 'action', 'StatisticsOnly', 'S4', 'MDKPrev');
	console.log('passportValue2 with prevComponentName: ' + passportValue2);

	// with prev component name and user id
	let passportValue3 = controlProxy.getSAPPassportHeaderValue('MDK', 'action', 'TRCLVL_Medium', 'Ariba', 'MDKPrev', 'userA');
	console.log('passportValue3 with prevComponentName & userId: ' + passportValue3);

	// empty string on all parameters
	let passportValue4 = controlProxy.getSAPPassportHeaderValue('', '', '', '');
	console.log('passportValue4 empty string on all parameters: ' + passportValue4);
	
	return passportValue1;
}
