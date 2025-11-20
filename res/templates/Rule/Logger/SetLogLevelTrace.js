export default function SetLogLevelTrace(sectionedTableProxy) {
  sectionedTableProxy.getLogger().setLevel("Trace").then(() => {
    sectionedTableProxy.getPageProxy().getClientData()['LogLevel'] = sectionedTableProxy.getLogger().getLevel();
    return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogLevelToast.action');
  });
}