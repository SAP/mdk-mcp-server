export default function SetLogLevelDebug(sectionedTableProxy) {
  sectionedTableProxy.getLogger().setLevel("Debug").then(() => {
    sectionedTableProxy.getPageProxy().getClientData()['LogLevel'] = sectionedTableProxy.getLogger().getLevel();
    return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogLevelToast.action');
  });
}