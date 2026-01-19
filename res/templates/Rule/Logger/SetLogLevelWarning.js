export default function SetLogLevelWarning(sectionedTableProxy) {
  sectionedTableProxy.getLogger().setLevel("Warn").then(() => {
    sectionedTableProxy.getPageProxy().getClientData()['LogLevel'] = sectionedTableProxy.getLogger().getLevel();
    return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogLevelToast.action');
  });
}