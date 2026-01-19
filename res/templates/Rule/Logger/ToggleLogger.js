export default function ToggleLogger(sectionedTableProxy) {
  return sectionedTableProxy.getLogger().toggle().then(() => {
    sectionedTableProxy.getPageProxy().getClientData()['LogState'] = sectionedTableProxy.getLogger().isTurnedOn();
    return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogStateToast.action');
  });
}