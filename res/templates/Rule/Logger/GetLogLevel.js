export default function GetLogLevel(sectionedTableProxy) {
  sectionedTableProxy.getPageProxy().getClientData()['LogLevel'] = sectionedTableProxy.getLogger().getLevel();
  return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogLevelToast.action');
}