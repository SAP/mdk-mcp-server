import { UUIDPlugin } from 'uuid-plugin';

export default function UuidPlugin(controlProxy) {
  let fullUUID = UUIDPlugin.uuid().toUpperCase();
  alert('full uuid from NS plugin: ' + fullUUID
    + '\n\nuuid (32): ' + fullUUID.substring(0, 32));
}
