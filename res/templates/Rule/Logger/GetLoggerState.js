export default function GetLoggerState(sectionedTableProxy) {
  sectionedTableProxy.getPageProxy().getClientData()['LogState'] = sectionedTableProxy.getLogger().isTurnedOn();
  return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogStateToast.action');
}