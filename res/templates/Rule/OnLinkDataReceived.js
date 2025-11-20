
export default function OnLinkDataReceived(clientAPI) {
	let linkData = clientAPI.getAppEventData();
	/*  For example:
	**  if the deeplink is mdkclient://Product?TheProductId=123,
	**  linkData will be a json object which will contain the data as below
	**  {
				"URL":"product",
				"URLScheme":"mdkclient:",
				"Parameters":{
					"TheProductId":"123"
				}
			}
	** This data can be parsed and used as needed
	*/
	console.log("OnLinkDataReceived Event! " + linkData);
}
