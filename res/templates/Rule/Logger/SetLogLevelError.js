export default function SetLogLevelError(sectionedTableProxy) {
  sectionedTableProxy.getLogger().setLevel("Error").then(() => {
    sectionedTableProxy.getPageProxy().getClientData()['LogLevel'] = sectionedTableProxy.getLogger().getLevel();
    return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogLevelToast.action');
  });
}