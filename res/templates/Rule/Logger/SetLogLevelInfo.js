export default function SetLogLevelInfo(sectionedTableProxy) {
  sectionedTableProxy.getLogger().setLevel("Info").then(() => {
    sectionedTableProxy.getPageProxy().getClientData()['LogLevel'] = sectionedTableProxy.getLogger().getLevel();
    return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogLevelToast.action');
  });
}