import { v4 as uuidv4 } from 'uuid';

export default function Uuid(controlProxy) {
  let fullUUID = uuidv4().toUpperCase();
  alert('full uuid: ' + fullUUID
    + '\n\nuuid (32): ' + fullUUID.substring(0, 32));
}
